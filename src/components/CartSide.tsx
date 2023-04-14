import { useCallback, useState } from "react";
import { proxy, subscribe, useSnapshot } from "valtio";
import CartIcon from "./CartIcon";
import MinusSignIcon from "./MinusSignIcon";
import PlusSignIcon from "./PlusSignIcon";
import { Product } from "./Products";
import TrashIcon from "./TrashIcon";
import { useForm } from "react-hook-form";
import { Input } from "./Input";

import { derive } from "valtio/utils";
import { toast } from "react-toastify";

type ProductCart = Product & { count: number };
const cartStore = proxy<{ products: ProductCart[]; total: number }>(
  JSON.parse(localStorage?.getItem("cart")) || {
    products: [],
  }
);

const calculations = derive({
  total: (get) =>
    get(cartStore).products.reduce(
      (acc, cur) => (acc += cur.price * cur.count),
      0
    ),
});

export const removeProductFromCart = (p: Product | ProductCart) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);
  cartStore.products.splice(idx, 1);
};
export const addProductToCart = (p: Product | ProductCart, count = 1) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);
  if (idx === -1) {
    cartStore.products.push({ count, ...p });
    toast("تمت الاضافة بنجاح.");
    return;
  }
  const product = cartStore.products[idx];
  if (product.quantity > product.count) product.count++;
};
const removeOne = (p: Product | ProductCart) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);
  if (idx === -1) {
    return;
  }
  const product = cartStore.products[idx];

  if (product.count > 1) {
    product.count--;
  } else {
    cartStore.products.splice(idx, 1);
  }
};
export const resetCart = () => {
  cartStore.products = [];
};
subscribe(cartStore, () => {
  localStorage.setItem("cart", JSON.stringify(cartStore));
});

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
function Cart() {
  const snap = useSnapshot(cartStore);
  return (
    <div className="p-4 bg-primary-500 rounded flex flex-col items-center gap-4 min-w-[20rem]">
      <h4 className="font-semibold">عربة التسوق</h4>
      <h5 className="text-sm">المجموع الفرعي</h5>
      {snap.products.map((p, idx) => (
        <div className="text-xs">
          <div className="flex gap-2 justify-center items-center">
            <span>{p.name}</span>
            <button onClick={() => removeOne(p)}>
              <MinusSignIcon />
            </button>
            <span>{p.count}</span>
            <button onClick={() => addProductToCart(p)}>
              <PlusSignIcon />
            </button>
            <span>{p.price * p.count}</span>
            <button onClick={() => removeProductFromCart(p)}>
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
      <div className="self-start flex justify-between w-full">
        <span>المجموع</span>
        <span className="font-bold">{calculations.total}</span>
      </div>
    </div>
  );
}
function AddressForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);
  return (
    <div className="p-4 bg-primary-500 rounded flex flex-col gap-4 min-w-[20rem]">
      <h3 className="self-center">تفاصيل التسليم</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          الاسم
          <Input {...register("name", { required: true })} className="mt-2" />
        </label>
      </form>
      <label>
        البريد الالكتروني
        <Input
          type="email"
          {...register("name", { required: true })}
          className="mt-2"
        />
      </label>
      <label>
        الهاتف
        <Input {...register("name", { required: true })} className="mt-2" />
      </label>
      <label>
        العنوان
        <Input {...register("name", { required: true })} className="mt-2" />
      </label>
      <label>
        ملاحظات على الطلبية
        <Input {...register("name")} className="mt-2" />
      </label>
    </div>
  );
}
export default function CartSide() {
  const [showCart, setShowCart] = useState(false);
  const toggleCart = useCallback(
    () => setShowCart((s) => (s = !s)),
    [showCart]
  );

  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-brand-500 rounded-full p-4"
        onClick={toggleCart}
      >
        <CartIcon />
      </button>
      {showCart ? (
        <aside
          className="fixed top-0 right-0 w-full h-full z-20 grid gap-2 place-items-center backdrop-blur shadow-sm overflow-auto"
          onClick={toggleCart}
        >
          <div
            className="relative grid grid-rows-3 grid-cols-1 px-8 max-w-md bg-primary-700 h-full place-items-center justify-self-end"
            onClick={(e) => e.stopPropagation()}
          >
            <button className=" absolute top-2 right-2" onClick={toggleCart}>
              <CloseIcon />
            </button>
            <Cart />
            <AddressForm />
          </div>
        </aside>
      ) : null}
    </>
  );
}
