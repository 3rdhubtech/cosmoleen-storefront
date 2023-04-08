import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

export type Product = {
  title: string;
  price: string;
  description: string;
  image: string;
};
function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.3 24.8C7.595 24.8 6.2155 26.195 6.2155 27.9C6.2155 29.605 7.595 31 9.3 31C11.005 31 12.4 29.605 12.4 27.9C12.4 26.195 11.005 24.8 9.3 24.8ZM24.8 24.8C23.095 24.8 21.7155 26.195 21.7155 27.9C21.7155 29.605 23.095 31 24.8 31C26.505 31 27.9 29.605 27.9 27.9C27.9 26.195 26.505 24.8 24.8 24.8ZM11.005 17.05H22.5525C23.715 17.05 24.738 16.4145 25.265 15.4535L31 4.588L28.2875 3.1L22.5525 13.95H11.6715L5.0685 0H0V3.1H3.1L8.68 14.8645L6.5875 18.6465C5.456 20.7235 6.944 23.25 9.3 23.25H27.9V20.15H9.3L11.005 17.05ZM17.05 0L23.25 6.2L17.05 12.4L14.8645 10.2145L17.3135 7.75H10.85V4.65H17.3135L14.849 2.1855L17.05 0Z"
        fill="white"
      />
    </svg>
  );
}
function EyeIcon({ className = "" }) {
  return (
    <svg
      width="18"
      height="12"
      className={className}
      viewBox="0 0 18 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 0C4.90909 0 1.41545 2.488 0 6C1.41545 9.512 4.90909 12 9 12C13.0909 12 16.5845 9.512 18 6C16.5845 2.488 13.0909 0 9 0ZM9 10C6.74182 10 4.90909 8.208 4.90909 6C4.90909 3.792 6.74182 2 9 2C11.2582 2 13.0909 3.792 13.0909 6C13.0909 8.208 11.2582 10 9 10ZM9 3.6C7.64182 3.6 6.54545 4.672 6.54545 6C6.54545 7.328 7.64182 8.4 9 8.4C10.3582 8.4 11.4545 7.328 11.4545 6C11.4545 4.672 10.3582 3.6 9 3.6Z"
        fill="#A6A6A6"
      />
    </svg>
  );
}

type ProductItemProps = {
  product: Product;
  openDialog: () => void;
};
type ProductLayoutProps = {
  products: Product[];
  openDialog: () => void;
};
function ListItem({ product, openDialog }: ProductItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const hovered = useCallback(() => setIsHovering(true), [isHovering]);
  const hoverOut = useCallback(() => setIsHovering(false), [isHovering]);

  return (
    <motion.article
      layout
      className="relative rounded-md shadow overflow-hidden bg-primary-500 grid grid-rows-1 grid-cols-3 lg:grid-cols-7 max-h-48 mx-4"
      onMouseOver={hovered}
      onMouseOut={hoverOut}
      onClick={openDialog}
    >
      {isHovering ? (
        <button
          className="absolute top-1 right-1 z-10"
          onClick={(e) => {
            e.stopPropagation();
            openDialog();
          }}
        >
          <EyeIcon />
        </button>
      ) : null}
      <figure className="aspect-w-16 aspect-h-10">
        <img src={product.image} className="object-contain w-full h-full" />
      </figure>
      <div className="p-6 lg:col-span-5">
        <h3 className="hover:text-brand-300 duration-500 ease-in-out">
          {product.title}
        </h3>
        <p className="text-slate-400 line-clamp-1 md:line-clamp-2">
          {product.description}
        </p>
      </div>
      <div className="flex flex-col justify-between p-2 justify-self-end items-end">
        <span className="font-bold mt-2">{product.price} د.ل</span>
        <button className="font-normal bg-brand-500 hover:bg-brand-700 text-white duration-500 ease-in-out py-2 px-4 rounded">
          <CartIcon />
        </button>
      </div>
    </motion.article>
  );
}

function ProductList({ products, openDialog }: ProductLayoutProps) {
  return (
    <div className="container mx-auto">
      <section className="grid grid-cols-1 gap-4">
        {products.map((p, idx) => (
          <ListItem product={p} key={idx} openDialog={openDialog} />
        ))}
      </section>
    </div>
  );
}

function GridItem({ product, openDialog }: ProductItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const hovered = useCallback(() => setIsHovering(true), [isHovering]);
  const hoverOut = useCallback(() => setIsHovering(false), [isHovering]);

  return (
    <motion.article
      className="relative rounded-md shadow overflow-hidden bg-primary-500 flex flex-col justify-between mx-4"
      onMouseOver={hovered}
      onMouseOut={hoverOut}
      onClick={openDialog}
    >
      {isHovering ? (
        <button
          className="absolute top-1 right-1 z-10"
          onClick={(e) => {
            e.stopPropagation();
            openDialog();
          }}
        >
          <EyeIcon />
        </button>
      ) : null}
      <figure className="aspect-w-16 aspect-h-10">
        <img src={product.image} className="object-contain w-full h-full" />
      </figure>
      <div className="p-6">
        <h3 className="title h5 text-lg font-medium hover:text-brand-300 duration-500 ease-in-out">
          {product.title}
        </h3>
        <p className="text-slate-400 mt-3 line-clamp-3">
          {product.description}
        </p>
      </div>
      <div className="flex justify-between p-2 items-center">
        <span className="font-bold">{product.price} د.ل</span>
        <button className="font-normal bg-brand-500 hover:bg-brand-700 text-white duration-500 ease-in-out py-2 px-4 rounded">
          <CartIcon />
        </button>
      </div>
    </motion.article>
  );
}
function ProductGrid({ products, openDialog }: ProductLayoutProps) {
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
          <GridItem product={p} key={idx} openDialog={openDialog} />
        ))}
      </section>
    </motion.div>
  );
}
type ProductsProps = {
  view: "grid" | "list";
  products: Product[];
};

export function Products({ view = "grid", products }: ProductsProps) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => {
    setOpen((open) => (open = !open));
  }, [open]);
  return (
    <motion.div layout transition={{ duration: 10 }}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed grid place-items-center backdrop-blur-sm">
            <Dialog.Content className="min-w-md bg-white p-8">
              hello
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <AnimatePresence mode="wait">
        {view === "grid" ? (
          <ProductGrid products={products} openDialog={toggle} />
        ) : (
          <ProductList products={products} openDialog={toggle} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
