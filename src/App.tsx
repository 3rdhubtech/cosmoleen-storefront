import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useSnapshot } from "valtio";
import { Arranges } from "./components/Arranges";
import CartIcon from "./components/CartIcon";
import CartSide from "./components/CartSide";
import Navbar from "./components/Navbar";
import { Product, Products } from "./components/Products";
import { mainStore } from "./stores";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products");
  return await res.json();
}

function App() {
  const snap = useSnapshot(mainStore);
  const query = useQuery(["products"], getProducts);

  return (
    <>
      <Navbar />
      <Arranges />
      {query.isSuccess ? (
        <Products view={snap.view} products={query.data} />
      ) : null}
      <CartSide />
    </>
  );
}

export default App;
