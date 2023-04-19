import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import parse from "html-react-parser";
import { EyeIcon, ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { CircularProgress, Seek } from "react-loading-indicators";
import { proxy, useSnapshot } from "valtio";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { addProductToCart } from "./CartSide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import "swiper/css/bundle";
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

async function getProducts({ pageParam = 1 }): Promise<Response> {
  const res = await fetch("api/products?page=" + pageParam);
  return await res.json();
}

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
      onClick={toggleDialog}
    >
      {isHovering ? (
        <button className="absolute top-2 right-2 shadow-soft">
          <EyeIcon className="fill-gray-300" />
        </button>
      ) : null}
      <img
        className="h-48 w-full shrink-0 rounded-t-lg bg-cover bg-center object-contain object-center bg-white lg:h-auto lg:w-48 lg:rounded-t-none lg:rounded-l-lg"
        src={`/is_cover_image/${product.cover}`}
        alt={product.name}
      />

      <div className="flex w-full grow flex-col px-4 py-3 sm:px-5">
        <div>
          <h3 className="text-lg font-medium text-white hover:text-brand-300 focus:text-brand-300">
            {product.name}
          </h3>
        </div>
        <div className="mt-1 line-clamp-3">{parse(product.description)}</div>

        <div className="mt-1 flex justify-end items-center mt-auto">
          <span className={cn("mr-auto font-bold", { hidden: !product.price })}>
            {product.price} د.ل
          </span>
          <button
            className="inline-flex cursor-pointer items-center justify-center rounded-lg px-5 py-2 text-center tracking-wide outline-none transition-all duration-200 focus:outline-none disabled:pointer-events-none px-2.5 py-1.5 font-medium text-white bg-brand-500 hover:bg-brand-500/70"
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

export function Products() {
  const { ref, inView } = useInView();

  const query = useInfiniteQuery(["products"], getProducts, {
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
      <div className="w-full h-full grid place-items-center">
        <CircularProgress variant="bubble-dotted" size="medium" />
      </div>
    );

  return (
    <>
      <ProductDialog />
      <div className="container mx-auto">
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
  if (snap.content === null || !snap.isOpen) return;
  return (
    <Dialog.Root
      open={snap.isOpen}
      onOpenChange={(state) => {
        setIsOpen(state);
        resetState();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed grid place-items-center backdrop-blur-sm z-50">
          <Dialog.Content className="flex flex-col gap-4 max-w-fit min-w-lg bg-primary-700 p-8 mx-4">
            <h4 className="font-bold">{snap.content.name}</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-96 self-center">
                <Swiper
                  grabCursor
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  modules={[A11y, Navigation, Pagination, Scrollbar]}
                >
                  {snap.content.images.map((s, i) => (
                    <SwiperSlide key={i}>
                      <img
                        src={`/product_image/${s}`}
                        className="h-full w-full rounded-lg object-cover"
                        alt={snap.content.name}
                        loading="lazy"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="border-2 py-1 px-2 rounded-xl">
                {parse(snap.content.description)}
              </div>
            </div>
            {Object.entries(snap.content.custom_fields).every(
              ([k, _v]) => k !== ""
            ) ? (
              <div className="border-2 py-1 px-2 rounded-xl empty mt-3 flex flex-col gap-4 text-xs">
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
                    <SelectTrigger className="py-2 px-2 border border-2 rounded-lg">
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
                <div className="border-2 py-1 flex flex-col gap-2 px-2 rounded-xl empty mt-3  text-xs">
                  <span>{variant.data.price}</span>
                  <span
                    className={cn(
                      "rounded-lg bg-brand-500 text-white px-1 py-2 self-start",
                      { "bg-red-700": !variant.data.quantity }
                    )}
                  >
                    {variant.data.quantity ? "متاح بالمخزن" : " غير متوفر"}
                  </span>
                </div>
              ) : variant.isFetching ? (
                <Seek />
              ) : null
            ) : (
              <div className="border-2 py-1 flex flex-col gap-2 px-2 rounded-xl empty mt-3  text-xs">
                <span>{snap.content.price}</span>
                <span className="rounded-xl bg-brand-500 text-white px-1 py-2 self-start">
                  {snap.content.quantity ? "متاح بالمخزن" : " غير متوفر"}
                </span>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
