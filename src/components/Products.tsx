import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import { EyeIcon, ShoppingCart, XIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CircularProgress, Seek } from "react-loading-indicators";
import { proxy, useSnapshot } from "valtio";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { addProductToCart } from "./CartSide";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import queryString from "query-string";
import "swiper/css/bundle";
import { pageState } from "@/stores";
import loadable from "@loadable/component";
const dialogStore = proxy<{ content: Product | null; isOpen: boolean }>({
  content: null,
  isOpen: false,
});
const setDialogContent = (product: Product) => {
  dialogStore.content = product;
};
const toggleDialog = () => (dialogStore.isOpen = !dialogStore.isOpen);
const setIsOpen = (state: boolean) => (dialogStore.isOpen = state);
type Response = {
  data: Product[];
  links: Links;
  meta: Meta;
};
type Meta = {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
};
type Variant = {
  variant_name: string;
  variant_options: string[];
};
type Links = {
  first: string;
  last: string;
  prev: any;
  next: string;
};
type Link = {
  url?: string;
  label: string;
  active: boolean;
};
export type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  SKU: string;
  custom_fields: Record<string, string>;
  has_variant: boolean;
  variants: Variant[];
  cover: string;
  description: string;
  images: string[];
};

type ItemProps = {
  product: Product;
  key: any;
};
const Item = ({ product }: ItemProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const hovered = useCallback(() => setIsHovering(true), [isHovering]);
  const hoverOut = useCallback(() => setIsHovering(false), [isHovering]);

  return (
    <article
      className="relative flex  min-w-[1px] flex-col break-words rounded-lg shadow-soft  print:border lg:flex-row bg-primary-500 "
      onMouseOver={hovered}
      onMouseOut={hoverOut}
      onTouchStart={hovered}
      onTouchEnd={hoverOut}
      onClick={() => {
        setDialogContent(product);
        toggleDialog();
      }}
    >
      {isHovering ? (
        <button className="absolute top-2 right-2 shadow-soft">
          <EyeIcon className="fill-gray-300" />
        </button>
      ) : null}
      <LazyLoadImage
        className="object-contain object-center w-full h-48 bg-white bg-center bg-cover rounded-t-lg shrink-0 lg:h-auto lg:w-48 lg:rounded-t-none lg:rounded-l-lg"
        src={`/is_cover_image/${product.cover}`}
        alt={product.name}
        width="480px"
        height="680px"
      />

      <div className="flex flex-col w-full px-4 py-3 grow sm:px-5">
        <div>
          <h3 className="text-lg font-medium text-white hover:text-brand-300 focus:text-brand-300">
            {product.name}
          </h3>
        </div>
        <div className="mt-1 line-clamp-3">{parse(product.description)}</div>

        <div className="flex items-center justify-end mt-auto">
          <span className={cn("mr-auto font-bold", { hidden: !product.price })}>
            {product.price} د.ل
          </span>
          <button
            className="inline-flex items-center justify-center px-5 py-2 font-medium tracking-wide text-center text-white transition-all duration-200 rounded-lg outline-none cursor-pointer focus:outline-none disabled:pointer-events-none bg-brand-500 hover:bg-brand-500/70"
            onClick={(e) => {
              e.stopPropagation();
              if (product.has_variant) {
                setDialogContent(product);
                toggleDialog();
              } else addProductToCart(product);
            }}
          >
            <ShoppingCart />
          </button>
        </div>
      </div>
    </article>
  );
};

async function getVariant(id: number, name: string) {
  return fetch(`/api/products/${id}/variant/${name}`).then((r) => r.json());
}
async function getProducts({
  pageParam = 1,
  queryKey: [_, data],
}: {
  pageParam?: number;
  queryKey: any[];
}): Promise<Response> {
  const params = {
    page: pageParam,
    category: data.categoryID ?? null,
    price: data.priceOrder ?? null,
    name: data.name,
  };

  return fetch(`/api/products?${queryString.stringify(params)}`).then((r) =>
    r.json()
  );
}
export default function Products() {
  const { ref, inView } = useInView();
  const snap = useSnapshot(pageState);
  const query = useInfiniteQuery(["products", { ...snap }], getProducts, {
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
  });

  useEffect(() => {
    if (inView) {
      query.fetchNextPage();
    }
  }, [inView]);

  if (!query.data)
    return (
      <div className="grid w-full h-full place-items-center">
        <CircularProgress variant="bubble-dotted" size="medium" />
      </div>
    );

  return (
    <>
      <ProductDialog />
      <div className="container md:mx-auto">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {query.data.pages.map((group) =>
            group.data.map((product, i) => (
              <Item product={product} key={`product-${i}`} />
            ))
          )}
        </section>
      </div>
      <div
        ref={ref}
        className={cn("w-full h-24 grid place-items-center", {
          hidden: !query.hasNextPage,
        })}
      >
        <Seek size="medium" />
      </div>
    </>
  );
}

function ProductDialog() {
  const snap = useSnapshot(dialogStore);

  const [id, setID] = useState(0);
  const [name, setName] = useState("");
  const [fetchVariant, setFetchVariant] = useState(false);
  const resetState = useCallback(() => {
    setID(0);
    setName("");
  }, [id, name]);
  const variant = useQuery(
    ["variant", { id, name }],
    () => getVariant(id, name),
    {
      enabled: fetchVariant && id !== 0,
      onSettled: () => setFetchVariant(false),
    }
  );
  if (snap.content === null || !snap.isOpen) return <></>;

  return (
    <Dialog.Root
      open={snap.isOpen}
      onOpenChange={(state) => {
        setIsOpen(state);
        resetState();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 grid overflow-y-scroll place-items-center backdrop-blur-sm">
          <Dialog.Content className="relative flex flex-col gap-4 max-w-fit min-w-lg bg-primary-700 md:p-8 md:mx-4">
            <button
              className="absolute z-50 p-2 ml-auto rounded-full right-2 top-2 bg-brand-900"
              onClick={toggleDialog}
            >
              <XIcon className="w-4 h-4" />
            </button>
            <h4 className="font-bold">{snap.content.name}</h4>
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="self-center w-96">
                <Swiper
                  grabCursor
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  modules={[A11y, Navigation, Pagination, Scrollbar]}
                >
                  {snap.content.images.map((s, i) => (
                    <SwiperSlide key={i}>
                      <LazyLoadImage
                        src={`/product_image/${s}`}
                        className="object-cover object-center rounded-lg"
                        alt={snap.content!.name}
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="px-2 py-1 border-2 rounded-xl max-h-min">
                {parse(snap.content.description)}
              </div>
            </div>
            {Object.entries(snap.content.custom_fields).every(
              ([k, _v]) => k !== ""
            ) ? (
              <div className="flex flex-col gap-4 px-2 py-1 mt-3 text-xs border-2 rounded-xl empty">
                {Object.entries(snap.content.custom_fields).map(
                  ([key, value], i) => {
                    return (
                      <span className="block" key={i}>
                        {key} : {value}
                      </span>
                    );
                  }
                )}
              </div>
            ) : null}
            {snap.content.has_variant &&
              snap.content.variants.map((v, i) => {
                return (
                  <Select
                    dir="rtl"
                    key={i}
                    onValueChange={(selected) => {
                      setID(snap.content!.id);
                      setName(selected);
                      setFetchVariant(true);
                    }}
                  >
                    <SelectTrigger className="px-2 py-2 border-2 rounded-lg">
                      <SelectValue placeholder={v.variant_name} />
                    </SelectTrigger>
                    <SelectContent>
                      {v.variant_options.map((o, j) => {
                        return (
                          <SelectItem value={o} key={`${i}-${j}`}>
                            {o}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                );
              })}
            {snap.content.has_variant ? (
              variant.isSuccess ? (
                <div className="flex items-center justify-between gap-2 px-2 py-1 mt-3 text-xs border-2 rounded-xl empty">
                  <span className="px-1 py-2 rounded-lg">
                    {variant.data.price}
                  </span>
                  <span
                    className={cn(
                      "rounded-lg bg-brand-500 text-white px-1 py-2",
                      { "bg-red-700": !variant.data.quantity }
                    )}
                  >
                    {variant.data.quantity ? "متاح بالمخزن " : " غير متوفر"}
                  </span>
                  <button
                    disabled={!variant.data.quantity}
                    className="inline-flex items-center justify-center px-5 py-2 font-medium tracking-wide text-center text-white transition-all duration-200 rounded-lg outline-none cursor-pointer focus:outline-none disabled:pointer-events-none bg-brand-500 hover:bg-brand-500/70"
                    onClick={(e) => {
                      addProductToCart(snap.content, variant.data);
                    }}
                  >
                    <ShoppingCart />
                  </button>
                </div>
              ) : variant.isFetching ? (
                <Seek />
              ) : null
            ) : (
              <div className="flex items-center justify-between gap-2 px-2 py-1 mt-3 text-xs border-2 rounded-xl empty">
                <span className="px-1 py-2 rounded-lg">
                  {snap.content.price}
                </span>
                <span
                  className={cn(
                    "rounded-lg bg-brand-500 text-white px-1 py-2",
                    { "bg-red-700": !snap.content.quantity }
                  )}
                >
                  {snap.content.quantity ? "متاح بالمخزن " : " غير متوفر"}
                </span>
                <button
                  disabled={!snap.content.quantity}
                  className="inline-flex items-center justify-center px-5 py-2 font-medium tracking-wide text-center text-white transition-all duration-200 rounded-lg outline-none cursor-pointer focus:outline-none disabled:pointer-events-none bg-brand-500 hover:bg-brand-500/70"
                  onClick={(e) => {
                    addProductToCart(snap.content);
                  }}
                >
                  <ShoppingCart />
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
