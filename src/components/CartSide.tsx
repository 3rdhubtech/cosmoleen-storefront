import { useCallback, useId, useState } from "react";
import { proxy, subscribe, useSnapshot } from "valtio";
import { zodI18nMap } from "zod-i18n-map";
import i18next from "i18next";
import translation from "zod-i18n-map/locales/ar/zod.json";
import { MinusIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { Product } from "./Products";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./Input";

import { derive } from "valtio/utils";
import { toast } from "react-toastify";
import { ShoppingCart } from "lucide-react";

import { useMutation, useQuery } from "@tanstack/react-query";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextArea } from "./TextArea";
import axios from "axios";
type Variant = {
  id: number;
  quantity: number;
  price: number;
  count: number;
};
type CartProduct = Product & {
  count: number;
  selectedVariants?: Variant[];
};

const cartStore = proxy<{ products: CartProduct[]; total: number }>(
  JSON.parse(localStorage?.getItem("cart") as string) || {
    products: [],
  }
);

const calculations = derive({
  total: (get) =>
    get(cartStore).products.reduce((acc, cur) => {
      acc += cur.has_variant
        ? cur!.selectedVariants!.reduce((acc, cur) => {
            acc += cur.price * cur.count;
            return acc;
          }, 0)
        : cur.price * cur.count;
      return acc;
    }, 0),
});

export const removeProductFromCart = (p: any, v?: Variant) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);

  if (
    cartStore.products[idx].has_variant &&
    cartStore.products[idx].selectedVariants &&
    v
  ) {
    const varIdx = cartStore.products[idx].selectedVariants!.findIndex(
      (vari) => vari.id === v.id
    );
    cartStore.products[idx].selectedVariants!.splice(varIdx, 1);
    return;
  }
  cartStore.products.splice(idx, 1);
};
export const addProductToCart = (
  p: any,
  selectedVariant?: Variant,
  count = 1
) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);
  if (idx === -1) {
    const product = {
      selectedVariants: selectedVariant ? [{ ...selectedVariant, count }] : [],
      count,
      ...p,
    };
    cartStore.products.push(product);
    toast("تمت الاضافة بنجاح.");
    return;
  }
  const product = cartStore.products[idx];
  if (product.has_variant && product.selectedVariants && selectedVariant) {
    const varIdx = product.selectedVariants.findIndex(
      (v) => v.id === selectedVariant.id
    );
    if (varIdx === -1) {
      product.selectedVariants.push({ ...selectedVariant, count });
      toast("تمت الاضافة بنجاح.");
      return;
    }
    const variant = product.selectedVariants[varIdx];
    if (variant.quantity > variant.count) {
      variant.count++;
    } else {
      toast("قد قمت باضافة كافة المخزون المتوفر", {
        type: "info",
      });
    }
    return;
  }

  if (product.quantity > product.count) {
    product.count++;
  } else {
    toast("قد قمت باضافة كافة المخزون المتوفر", {
      type: "info",
    });
  }
};
const removeOne = (p: any, v: any = null) => {
  const idx = cartStore.products.findIndex((pc) => p.id === pc.id);
  if (idx === -1) {
    return;
  }
  const product = cartStore.products[idx];
  if (product.has_variant && product.selectedVariants) {
    const varIdx = product.selectedVariants.findIndex(
      (vari) => vari.id === v.id
    );
    const variant = product.selectedVariants[varIdx];
    if (variant.count > 1) {
      variant.count--;
    } else {
      product.variants.splice(varIdx, 1);
    }
  } else if (product.count > 1) {
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
    <div className="flex flex-col gap-4 items-center p-4 rounded bg-primary-500 min-w-[20rem]">
      <h4 className="font-semibold">عربة التسوق</h4>
      <h5 className="self-start text-sm">المجموع الفرعي</h5>
      {snap.products.map((p, idx) =>
        !p.has_variant ? (
          <div className="w-full text-xs" key={idx}>
            <div className="grid items-center justify-between grid-cols-2 gap-2">
              <span className="justify-self-start">{p.name}</span>
              <div className="flex items-center gap-1 justify-self-end">
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
        ) : (
          p.selectedVariants!.map((v, idx) => (
            <div className="w-full text-xs" key={idx}>
              <div className="grid items-center justify-between grid-cols-2 gap-2">
                <span className="justify-self-start">{p.name}</span>
                <div className="flex items-center gap-1 justify-self-end">
                  <button onClick={() => removeOne(p, v)}>
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span>{v.count}</span>
                  <button onClick={() => addProductToCart(p, v)}>
                    <PlusIcon className="w-4 h-4" />
                  </button>
                  <span>{v.price * v.count}</span>
                  <button onClick={() => removeProductFromCart(p, v)}>
                    <Trash2Icon />
                  </button>
                </div>
              </div>
            </div>
          ))
        )
      )}
      <div className="flex self-start justify-between w-full">
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
async function getShipping(id: string): Promise<Shipping[]> {
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
  email: z.string().email().optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^09(1|2|4|5)[0-9]{7}$/, { message: "رقم الهاتف غير صحيح" }),
  address: z.string().min(5),
  note: z.string().optional(),
  location: z
    .string()
    .nonempty()
    .regex(/[0-9]+/),
  shipping: z
    .string()
    .nonempty()
    .regex(/[0-9]+/),
});
function postBuy(data: any) {
  return axios.post("/api/buy", data);
  // return fetch("/api/buy", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: data,
  // });
}
function AddressForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      note: "",
      location: "0",
      shipping: "0",
    },
    resolver: zodResolver(schema),
  });
  const snap = useSnapshot(cartStore);
  const id = useId();
  const [locID, setLocID] = useState("");
  const mutation = useMutation({
    mutationFn: (formData: any) => postBuy(formData),
    onSuccess: () => resetCart(),
    onError: () =>
      toast("حدث خطأ غير متوقع", {
        type: "error",
      }),
  });
  const onSubmit = (data: any) => {
    const products = snap.products
      .map((product) => {
        if (product.has_variant) {
          return product.selectedVariants!.map((vari) => {
            return { id: product.id, var_id: vari.id, count: vari.count };
          });
        }
        return { id: product.id, count: product.count };
      })
      .flat();
    mutation.mutate({ ...data, products });
  };
  const locations = useQuery(["locations"], getLocations);
  const shipping = useQuery(
    ["shipping", { id: locID }],
    () => getShipping(locID),
    {
      enabled: !!locID,
    }
  );
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid items-center gap-2"
    >
      <div className="flex flex-col gap-4 p-4 rounded bg-primary-500 min-w-[20rem]">
        <h3 className="self-center">تفاصيل التسليم</h3>
        <div>
          <label
            htmlFor={`name-${id}`}
            className="flex items-center justify-between"
          >
            الاسم
            <span className="text-xs text-red-300">اجباري</span>
          </label>
          <Input {...register("name")} id={`name-${id}`} className="mt-2" />
          <p className="text-red-500 empty">{errors.name?.message}</p>
        </div>
        <div>
          <label
            htmlFor={`phone-${id}`}
            className="flex items-center justify-between"
          >
            الهاتف
            <span className="text-xs text-red-300">اجباري</span>
          </label>
          <Input
            {...register("phone")}
            placeholder="09xxxxxxxx"
            id={`phone-${id}`}
            className="mt-2"
          />
          <p className="text-red-500 empty">{errors.phone?.message}</p>
        </div>
        <div>
          <label htmlFor={`email-${id}`}>البريد الالكتروني</label>
          <Input
            type="email"
            {...register("email")}
            id={`email-${id}`}
            className="mt-2"
          />
          <p className="text-red-500 empty">{errors.email?.message}</p>
        </div>
        <div>
          <label
            htmlFor={`address-${id}`}
            className="flex items-center justify-between"
          >
            العنوان
            <span className="text-xs text-red-300">اجباري</span>
          </label>
          <Input
            {...register("address")}
            id={`address-${id}`}
            className="mt-2"
          />
          <p className="text-red-500 empty">{errors.address?.message}</p>
        </div>

        <Controller
          name="location"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange } }) => (
            <div>
              <label
                htmlFor={`city-${id}`}
                className="flex items-center justify-between"
              >
                اختر المدينة
                <span className="text-xs text-red-300">اجباري</span>
              </label>
              <select
                className="flex w-full h-10 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-slate-300 bg-primary-700 placeholder:text-slate-400 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 focus:ring-slate-400"
                id={`city-${id}`}
                onChange={(e) => {
                  onChange(e);
                  setLocID(e.target.value);
                }}
                defaultValue="0"
              >
                <option disabled value="0"></option>
                {locations?.data?.map((location) => (
                  <option value={`${location.id}`} key={`${location.id}`}>
                    {location.name}
                  </option>
                ))}
              </select>
              <p className="text-red-500 empty">{errors.location?.message}</p>
            </div>
          )}
        />
        {shipping.data && shipping.data.length && (
          <Controller
            name="shipping"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <div>
                <label
                  className="flex items-center justify-between"
                  htmlFor={`shipment-${id}`}
                >
                  اختر طريقة التوصيل
                  <span className="text-xs text-red-300">اجباري</span>
                </label>
                <select
                  className="flex w-full h-10 px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed border-slate-300 bg-primary-700 placeholder:text-slate-400 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 focus:ring-slate-400"
                  onChange={(e) => {
                    onChange(e);
                    setLocID(e.target.value);
                  }}
                  id={`shipment-${id}`}
                  defaultValue="0"
                >
                  <option disabled value="0"></option>
                  {shipping.data.map((shipping) => (
                    <option value={shipping.id} key={shipping.id}>
                      {shipping.name}
                    </option>
                  ))}
                </select>
                <p className="text-red-500 empty">{errors.shipping?.message}</p>
              </div>
            )}
          />
        )}
        <div>
          <label htmlFor={`note-${id}`}>ملاحظات على الطلبية</label>
          <TextArea {...register("note")} id={`note-${id}`} className="mt-2" />
          <p className="text-red-500 empty">{errors.note?.message}</p>
        </div>
      </div>
      {isValid && (
        <button className="inline-flex items-center justify-center gap-2 px-4 py-3 font-semibold border-2 rounded-md border-primary-500">
          <span>طلبية عبر واتساب</span>
          <svg
            height="24px"
            width="24px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 418.135 418.135"
          >
            <g>
              <path
                className="fill-brand-500"
                d="M198.929,0.242C88.5,5.5,1.356,97.466,1.691,208.02c0.102,33.672,8.231,65.454,22.571,93.536
            L2.245,408.429c-1.191,5.781,4.023,10.843,9.766,9.483l104.723-24.811c26.905,13.402,57.125,21.143,89.108,21.631
            c112.869,1.724,206.982-87.897,210.5-200.724C420.113,93.065,320.295-5.538,198.929,0.242z M323.886,322.197
            c-30.669,30.669-71.446,47.559-114.818,47.559c-25.396,0-49.71-5.698-72.269-16.935l-14.584-7.265l-64.206,15.212l13.515-65.607
            l-7.185-14.07c-11.711-22.935-17.649-47.736-17.649-73.713c0-43.373,16.89-84.149,47.559-114.819
            c30.395-30.395,71.837-47.56,114.822-47.56C252.443,45,293.218,61.89,323.887,92.558c30.669,30.669,47.559,71.445,47.56,114.817
            C371.446,250.361,354.281,291.803,323.886,322.197z"
              />
              <path
                className="fill-brand-500"
                d="M309.712,252.351l-40.169-11.534c-5.281-1.516-10.968-0.018-14.816,3.903l-9.823,10.008
            c-4.142,4.22-10.427,5.576-15.909,3.358c-19.002-7.69-58.974-43.23-69.182-61.007c-2.945-5.128-2.458-11.539,1.158-16.218
            l8.576-11.095c3.36-4.347,4.069-10.185,1.847-15.21l-16.9-38.223c-4.048-9.155-15.747-11.82-23.39-5.356
            c-11.211,9.482-24.513,23.891-26.13,39.854c-2.851,28.144,9.219,63.622,54.862,106.222c52.73,49.215,94.956,55.717,122.449,49.057
            c15.594-3.777,28.056-18.919,35.921-31.317C323.568,266.34,319.334,255.114,309.712,252.351z"
              />
            </g>
          </svg>
        </button>
      )}
    </form>
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
        className="fixed p-4 rounded-full right-5 bottom-5 bg-brand-500"
        onClick={toggleCart}
      >
        <ShoppingCart />
      </button>
      {showCart ? (
        <aside
          className="fixed top-0 right-0 z-20 grid w-full h-full gap-2 overflow-auto shadow-sm place-items-center backdrop-blur"
          onClick={toggleCart}
        >
          <div
            className="grid h-full max-w-md grid-cols-1 gap-4 px-8 py-4 justify-self-end place-items-center bg-primary-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="sticky z-50 p-1 ml-auto rounded-full top-2 bg-brand-900"
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
