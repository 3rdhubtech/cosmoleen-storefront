import Navbar from "./components/Navbar";
import { faker } from "@faker-js/faker/locale/ar";
import { ProductList, ProductGrid } from "./components/Products";
import { useSnapshot } from "valtio";
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

function createProduct() {
  return Array(100)
    .fill(0)
    .map(() => ({
      name: faker.commerce.productName(),
      price: faker.commerce.price(100),
      description: faker.commerce.productDescription(),
      photo: faker.image.avatar(),
    }));
}

function App() {
  const products = createProduct();
  const snap = useSnapshot(mainStore);
  return (
    <>
      <Navbar />
      <Arranges />
      {snap.view === "grid" ? (
        <ProductGrid products={products} />
      ) : (
        <ProductList products={products} />
      )}
    </>
  );
}

export default App;
