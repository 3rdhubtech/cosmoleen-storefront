import { AnimatePresence, motion } from "framer-motion";
import {
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
import { CircularProgress } from "react-loading-indicators";
import { useQuery } from "@tanstack/react-query";
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
  variants: string;
  cover: string;
  description: string;
  images: string[];
};

type ProductItemProps = {
  product: Product;

  key: number;
};
type ProductLayoutProps = {
  products: Product[];
};
function ListItem({ product }: ProductItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const hovered = useCallback(() => setIsHovering(true), [isHovering]);
  const hoverOut = useCallback(() => setIsHovering(false), [isHovering]);

  return (
    <motion.article
      layout
      className="relative rounded-md shadow overflow-hidden bg-primary-500 grid grid-rows-1 grid-cols-2 max-h-48 mx-4"
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
      <figure className="row-span-2 aspect-w-16 aspect-h-10">
        <img
          src={`/is_cover_image/${product.cover}`}
          className="object-contain w-full h-full bg-white"
        />
      </figure>
      <div className="flex flex-col justify-between p-2">
        <div>
          <h3 className="hover:text-brand-300 duration-500 ease-in-out">
            {product.name}
          </h3>
          <p className="text-slate-400 line-clamp-1 md:line-clamp-2">
            {parse(product.description)}
          </p>
        </div>
        <div className="flex justify-between">
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
}

function ProductList({ products }: ProductLayoutProps) {
  return (
    <div className="container mx-auto">
      <section className="grid grid-cols-1 gap-4">
        {products.map((p, idx) => (
          <ListItem product={p} key={idx} />
        ))}
      </section>
    </div>
  );
}

function GridItem({ product }: ProductItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const hovered = useCallback(() => setIsHovering(true), [isHovering]);
  const hoverOut = useCallback(() => setIsHovering(false), [isHovering]);
  return (
    <motion.article
      className="relative rounded-md shadow overflow-hidden bg-primary-500 flex flex-col justify-between mx-4"
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
      <figure
        className="aspect-w-16 aspect-h-10 bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={`/is_cover_image/${product.cover}`}
          className="object-contain w-full h-full"
        />
      </figure>
      <div className="p-6">
        <h3 className="title h5 text-lg font-medium hover:text-brand-300 duration-500 ease-in-out">
          {product.name}
        </h3>
        <p className="text-slate-400 mt-3 line-clamp-3">
          {parse(product.description)}
        </p>
      </div>
      <div className="flex justify-between p-2 items-center">
        {product.has_variant ? (
          <span></span>
        ) : (
          <span className="font-bold">{product.price} د.ل</span>
        )}
        <button
          className="font-normal bg-brand-500 hover:bg-brand-700 text-white duration-500 ease-in-out py-2 px-4 rounded"
          onClick={(e) => {
            e.stopPropagation();
            if (product.has_variant) {
              toggleDialog();
              setDialogContent(product);
            } else addProductToCart(product);
          }}
        >
          <CartIcon />
        </button>
      </div>
    </motion.article>
  );
}
function ProductGrid({ products }: ProductLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="container mx-auto"
    >
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p, idx) => (
          <GridItem product={p} key={idx} />
        ))}
      </section>
    </motion.div>
  );
}
type ProductsProps = {
  view: "grid" | "list";
};
async function getProducts(): Promise<Response> {
  const res = await fetch("api/products");
  return await res.json();
}
export function Products({ view = "grid" }: ProductsProps) {
  const snap = useSnapshot(dialogStore);
  const query = useQuery(["products"], getProducts);
  if (!query.data)
    return <CircularProgress variant="bubble-dotted" size="medium" />;
  return (
    <div>
      {snap.content ? (
        <Dialog.Root open={snap.isOpen} onOpenChange={setIsOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="inset-0 fixed grid place-items-center backdrop-blur-sm z-50">
              <Dialog.Content className="flex flex-col gap-4 max-w-min min-w-md bg-primary-700 p-8">
                <h4 className="font-bold">{snap!.content!.name}</h4>

                <Slider>
                  {snap!.content!.images.map((s, idx) => (
                    <Slider.Item key={idx}>
                      <img src={`/product_image/${s}`} />
                    </Slider.Item>
                  ))}
                </Slider>
                <div>{parse(snap!.content!.description || "")}</div>
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog.Portal>
        </Dialog.Root>
      ) : null}
      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <ProductGrid products={query.data.data} />
        ) : (
          <ProductList products={query.data.data} />
        )}
      </AnimatePresence>
    </div>
  );
}
function Slider({
  children,
}: {
  children: ReactElement<typeof Slider.Item>[];
}) {
  const [counter, setCounter] = useState(0);
  console.log(children);
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
    <motion.div className="max-w-min relative" layout>
      <button
        className="px-1 py-2 absolute bottom-1/2 translate-y-1/2 hover:bg-gray-100 rounded-e-md"
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
        className="px-1 py-2 absolute bottom-1/2 right-0 translate-y-1/2 hover:bg-gray-100 rounded-s-md"
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
    </motion.div>
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
