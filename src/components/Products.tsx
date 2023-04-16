import { motion } from "framer-motion";
import {
  forwardRef,
  Fragment,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import parse from "html-react-parser";
import * as Dialog from "@radix-ui/react-dialog";
import EyeIcon from "./EyeIcon";
import CartIcon from "./CartIcon";
import { addProductToCart } from "./CartSide";
import { proxy, useSnapshot } from "valtio";
import { CircularProgress, Seek } from "react-loading-indicators";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { VariantProps, cva } from "cva";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
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
          className="absolute top-1 right-1 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setDialogContent(product);
            toggleDialog();
          }}
        >
          <EyeIcon />
        </button>
      ) : null}
      <figure className="row-span-2 aspect-w-16 aspect-h-10 bg-white">
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
            <CartIcon />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export function Products({ view = "grid" }: ProductsProps) {
  const { ref, inView } = useInView();
  const snap = useSnapshot(dialogStore);
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
      {snap.content ? (
        <Dialog.Root open={snap.isOpen} onOpenChange={setIsOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="inset-0 fixed grid place-items-center backdrop-blur-sm z-50">
              <Dialog.Content className="flex flex-col gap-4 max-w-min min-w-lg bg-primary-700 p-8">
                <h4 className="font-bold">{snap!.content!.name}</h4>

                <Slider>
                  {snap!.content!.images.map((s, idx) => (
                    <Slider.Item key={idx}>
                      <img
                        className="w-full h-56"
                        src={`/product_image/${s}`}
                      />
                    </Slider.Item>
                  ))}
                </Slider>
                <div className="border-2 py-1 px-2 rounded-xl">
                  {parse(snap!.content!.description)}
                </div>

                {Object.entries(snap.content.custom_fields).every(
                  ([k, _v]) => k !== ""
                ) ? (
                  <div className="border-2 py-1 px-2 rounded-xl empty mt-3 flex flex-col gap-4 text-xs">
                    {Object.entries(snap!.content.custom_fields).map(
                      ([key, value], i) => {
                        return (
                          <span className="block">
                            {key} : {value}
                          </span>
                        );
                      }
                    )}
                  </div>
                ) : null}
                {snap.content.has_variant &&
                  snap!.content!.variants.map((v) => {
                    return (
                      <Select dir="rtl">
                        <SelectTrigger>
                          <SelectValue placeholder={v.variant_name} />
                        </SelectTrigger>
                        <SelectContent>
                          {v.variant_options.map((o) => {
                            return <SelectItem value={o}>{o}</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    );
                  })}
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      ) : null}
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
function Slider({
  children,
}: {
  children: ReactElement<typeof Slider.Item>[];
}) {
  const [counter, setCounter] = useState(0);

  const len = children.length;
  const nextSlide = useCallback(() => {
    if (counter < len - 1) setCounter((counter) => (counter += 1));
    else setCounter(0);
  }, [counter]);
  const prevSlide = useCallback(() => {
    if (counter > 0) setCounter((counter) => (counter -= 1));
    else setCounter(len - 1);
  }, [counter]);

  return (
    <div className="max-w-min relative">
      <button
        className=" py-2 absolute bottom-1/2 translate-y-1/2 bg-gray-400  hover:bg-gray-300 rounded-e-md"
        onClick={nextSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
      <div className="flex overflow-x-hidden rounded-2xl w-64">
        {children[counter]}
      </div>
      <button
        className=" py-2 absolute bottom-1/2 right-0 translate-y-1/2 bg-gray-400 hover:bg-gray-300 rounded-s-md"
        onClick={prevSlide}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
    </div>
  );
}
Slider.Item = SliderItem;
function SliderItem({ children }: { children: ReactNode; key?: any }) {
  return (
    <div className="box-content flex flex-none snap-start w-full">
      {children}
    </div>
  );
}
