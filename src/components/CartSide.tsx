import { useCallback, useState } from "react";
import { proxy, subscribe, useSnapshot } from "valtio";
import { zodI18nMap } from "zod-i18n-map";
import i18next from "i18next";
import translation from "zod-i18n-map/locales/ar/zod.json";
import { MinusIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { Product } from "./Products";

import { useForm } from "react-hook-form";
import { Input } from "./Input";

import { derive } from "valtio/utils";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
const cartStore = proxy<{ products: any[]; total: number }>(
  JSON.parse(localStorage?.getItem("cart") as string) || {
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

export const removeProductFromCart = (p: any) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);
  cartStore.products.splice(idx, 1);
};
export const addProductToCart = (p: Product, count = 1) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);
  if (idx === -1) {
    cartStore.products.push({ count, ...p });
    toast("تمت الاضافة بنجاح.");
    return;
  }
  const product = cartStore.products[idx];
  if (product.quantity > product.count) product.count++;
};
const removeOne = (p: any) => {
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

function Cart() {
  const snap = useSnapshot(cartStore);

  return (
    <div className="p-4 bg-primary-500 rounded flex flex-col items-center gap-4 min-w-[20rem]">
      <h4 className="font-semibold">عربة التسوق</h4>
      <h5 className="text-sm self-start">المجموع الفرعي</h5>
      {snap.products.map((p, idx) => (
        <div className="text-xs w-full" key={idx}>
          <div className="grid gap-2 grid-cols-2 justify-between items-center">
            <span className="justify-self-start">{p.name}</span>
            <div className="justify-self-end flex items-center gap-1">
              <button onClick={() => removeOne(p)}>
                <MinusIcon className="w-4 h-4" />
              </button>
              <span>{p.count}</span>
              <button onClick={() => addProductToCart(p)}>
                <PlusIcon className="w-4 h-4" />
              </button>
              <span>{p.price * p.count}</span>
              <button onClick={() => removeProductFromCart(p)}>
                <Trash2Icon />
              </button>
            </div>
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
type Location = { id: number; name: string };
async function getLocations(): Promise<Location[]> {
  return fetch("/api/locations").then((r) => r.json());
}
type Shipping = Location;
async function getShipping(id: number): Promise<Shipping[]> {
  return fetch(`/api/locations/${id}/shipping`).then((r) => r.json());
}

i18next.init({
  lng: "ar",
  resources: {
    ar: { zod: translation },
  },
});
z.setErrorMap(zodI18nMap);
const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^09(1|2|4|5)[0-9]{7}$/, { message: "رقم الهاتف غير صحيح" }),
  address: z.string().min(5),
  note: z.string().optional(),
  location: z.number().int(),
  shipping: z.number().int(),
});
function AddressForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      note: "",
      location: "",
      shipping: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => console.log(data);
  const locations = useQuery(["locations"], getLocations);

  // const shipping = useQuery(
  //   ["shipping", { id: selectedLocationID }],
  //   () => getShipping(selectedLocationID),
  //   {
  //     enabled: !!selectedLocationID,
  //   }
  // );
  return (
    <div className="p-4 bg-primary-500 rounded flex flex-col gap-4 min-w-[20rem]">
      <h3 className="self-center">تفاصيل التسليم</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <label>
          الاسم
          <Input {...register("name")} className="mt-2" />
          <p className="empty text-red-500">{errors.name?.message}</p>
        </label>
        <label>
          البريد الالكتروني
          <Input type="email" {...register("email")} className="mt-2" />
          <p className="empty text-red-500">{errors.email?.message}</p>
        </label>
        <label>
          الهاتف
          <Input {...register("phone")} className="mt-2" />
          <p className="empty text-red-500">{errors.phone?.message}</p>
        </label>
        <label>
          العنوان
          <Input {...register("address")} className="mt-2" />
          <p className="empty text-red-500">{errors.address?.message}</p>
        </label>
        <label>
          ملاحظات على الطلبية
          <Input {...register("note")} className="mt-2" />
          <p className="empty text-red-500">{errors.note?.message}</p>
        </label>
        <label>
          اختر المدينة
          <select
            {...register("location")}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-primary-700 py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          >
            {locations?.data?.map((location) => (
              <option value={`${location.id}`} key={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
        {/*
        <label>
          اختر طريقة التوصيل
          <select
            {...register("location")}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-primary-700 py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
          >
            {shipping?.data?.map((shipping) => (
              <option value={shipping.id} key={shipping.id}>
                {shipping.name}
              </option>
            ))}
          </select>
        </label>
          */}
      </form>
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
        <ShoppingCart />
      </button>
      {showCart ? (
        <aside
          className="fixed top-0 right-0 w-full h-full z-20 grid gap-2 place-items-center backdrop-blur shadow-sm overflow-auto"
          onClick={toggleCart}
        >
          <div
            className="grid grid-cols-1 px-8 py-4 gap-4 max-w-md bg-primary-700 h-full place-items-center justify-self-end"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="rounded-full top-2 right-2 fixed z-50"
              onClick={toggleCart}
            >
              <XIcon className="w-4 h-4" />
            </button>
            <Cart />
            <AddressForm />
          </div>
        </aside>
      ) : null}
    </>
  );
}
