import { proxy, subscribe } from "valtio";

export const pageState = proxy<{
  categoryID?: string;
  priceOrder?: string;
  name?: string;
}>({});

export const pageAction = {
  setCategory: (id: string) => (pageState.categoryID = id),
  setPriceOrder: (order: string) => (pageState.priceOrder = order),
  setName: (e, func) => {
    if (e.key === "Enter") {
      pageState.name = e.target.value;
      func();
    }
  },
};

subscribe(pageState, () => console.log("hello"));
