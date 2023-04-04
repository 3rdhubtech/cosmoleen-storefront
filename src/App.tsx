import { useQuery } from "react-query";
import { useSnapshot } from "valtio";
import Navbar from "./components/Navbar";
import { Product, Products } from "./components/Products";
import { mainStore } from "./stores";

function ArrowDownList() {
  return (
    <svg
      width="10"
      height="5"
      viewBox="0 0 10 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0L5 5L10 0H0Z" fill="white" />
    </svg>
  );
}
function Arranges() {
  return (
    <section className="flex my-4 mx-2 justify-center gap-2">
      <div className="bg-primary-500 px-3 py-1 flex items-center gap-1  rounded-md">
        <span>التصنيف: </span>
        <span>نظارات</span>
      </div>
      <div className="bg-primary-500 px-3 py-1 flex items-center gap-1  rounded-md">
        <span> ترتيب حسب: </span>
        <span>سعر</span>
        <ArrowDownList />
      </div>
    </section>
  );
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://fakestoreapi.com/products");
  return await res.json();
}
function App() {
  const snap = useSnapshot(mainStore);
  const query = useQuery("products", getProducts);
  console.log(query.data);
  return (
    <>
      <Navbar />
      <Arranges />
      {query.isSuccess ? (
        <Products view={snap.view} products={query.data} />
      ) : null}
    </>
  );
}

export default App;
