import { cn } from "@/lib/utils";
import { useSignal } from "@preact/signals-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { cva, VariantProps } from "cva";
import { motion } from "framer-motion";
import parse from "html-react-parser";
import { EyeIcon, ShoppingCart } from "lucide-react";
import {
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import { CircularProgress, Seek } from "react-loading-indicators";
import { proxy, useSnapshot } from "valtio";
import Carousel from "./Carousel";
import { addProductToCart } from "./CartSide";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import Slider from "./Slider";
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

type ProductsProps = {
  view: "grid" | "list";
};
async function getProducts({ pageParam = 1 }): Promise<Response> {
  const res = await fetch("api/products?page=" + pageParam);
  return await res.json();
}

const productViewVariant = cva("grid grid-cols-1", {
  variants: {
    view: {
      grid: "md:grid-cols-3 lg:grid-cols-4 gap-8",
      list: "gap-4",
    },
  },
});
interface ProductViewProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof productViewVariant> {}
const ProductView = forwardRef<HTMLElement, ProductViewProps>(
  ({ className, view, ...props }, ref) => {
    return (
      <section
        className={cn(productViewVariant({ view, className }))}
        ref={ref}
        {...props}
      ></section>
    );
  }
);
const itemProps = cva(
  "relative rounded-md shadow overflow-hidden bg-primary-500 mx-4",
  {
    variants: {
      view: {
        grid: "flex flex-col justify-between",
        list: "grid grid-rows-1 grid-cols-2 max-h-48",
      },
    },
  }
);
type ItemProps = VariantProps<typeof itemProps> & {
  product: Product;
  key: any;
};
const Item = ({ view, product }: ItemProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const hovered = useCallback(() => setIsHovering(true), [isHovering]);
  const hoverOut = useCallback(() => setIsHovering(false), [isHovering]);

  return (
    <motion.article
      layout
      className={cn(itemProps({ view }))}
      onMouseOver={hovered}
      onMouseOut={hoverOut}
      onClick={toggleDialog}
    >
      {isHovering ? (
        <button
          className="absolute top-1 right-1 z-[1]"
          onClick={(e) => {
            e.stopPropagation();
            setDialogContent(product);
            toggleDialog();
          }}
        >
          <EyeIcon fill="gray" />
        </button>
      ) : null}
      <figure className="row-span-2 aspect-video bg-white">
        <img
          src={`/is_cover_image/${product.cover}`}
          className="object-contain w-full h-full"
        />
      </figure>
      <div
        className={cn({
          "flex flex-col justify-between p-2": view === "list",
        })}
      >
        <div className={cn({ "p-6": view === "grid" })}>
          <h3 className="title h5 text-lg font-medium hover:text-brand-300 duration-500 ease-in-out">
            {product.name}
          </h3>
          <span
            className={cn("text-slate-400  mt-3 line-clamp-3", {
              "line-clamp-1 md:line-clamp-2": view === "list",
            })}
          >
            {parse(product.description)}
          </span>
        </div>
        <div
          className={cn("flex justify-between", {
            "p-2 items-center": view === "grid",
          })}
        >
          {product.has_variant ? (
            <span></span>
          ) : (
            <span className="font-bold mt-2">{product.price} د.ل</span>
          )}
          <button
            className="font-normal bg-brand-500 hover:bg-brand-700 text-white duration-500 ease-in-out py-2 px-4 rounded"
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
    </motion.article>
  );
};

async function getVariant(id: number, name: string) {
  return fetch(`/api/products/${id}/variant/${name}`).then((r) => r.json());
}

export function Products({ view = "grid" }: ProductsProps) {
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
        <ProductView view={view}>
          {query.data.pages.map((group) =>
            group.data.map((product, i) => (
              <Item view={view} product={product} key={`product-${i}`} />
            ))
          )}
        </ProductView>
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
              <Carousel className="w-64 self-center">
                {snap.content.images.map((s, i) => (
                  <img src={`/product_image/${s}`} key={i} />
                ))}
              </Carousel>
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
              ) : !variant.isStale ? (
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
