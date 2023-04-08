import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import EyeIcon from "./EyeIcon";
import CartIcon from "./CartIcon";

export type Product = {
  title: string;
  price: string;
  description: string;
  image: string;
};

type ProductItemProps = {
  product: Product;
  openDialog: () => void;
  key: number;
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
        <img
          src={product.image}
          className="object-contain w-full h-full bg-white"
        />
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
      <figure className="aspect-w-16 aspect-h-10 bg-white">
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
    <div>
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
    </div>
  );
}
