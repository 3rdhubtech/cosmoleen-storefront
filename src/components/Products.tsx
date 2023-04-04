export type Product = {
  title: string;
  price: string;
  description: string;
  image: string;
};

function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="container mx-auto">
      <section className="grid grid-cols-1 gap-4">
        {products.map((p, idx) => (
          <article
            key={idx}
            className="rounded-md shadow overflow-hidden bg-primary-500 grid grid-rows-1 grid-cols-3 max-h-48"
          >
            <figure className="aspect-w-16 aspect-h-10">
              <img src={p.image} className="object-fill w-full h-full" />
            </figure>
            <div className="p-6">
              <h3 className=" hover:text-brand-300 duration-500 ease-in-out">
                {p.title}
              </h3>
              <p className="text-slate-400 line-clamp-1 md:line-clamp-2 hover:line-clamp-none">
                {p.description}
              </p>
            </div>
            <div className="flex flex-col justify-between p-2 justify-self-end items-end">
              <span className="font-bold">{p.price} د.ل</span>
              <button className="font-normal bg-brand-500 hover:bg-brand-700 text-white duration-500 ease-in-out py-2 px-4 rounded">
                اضافة للعربة
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="container mx-auto">
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p, idx) => (
          <article
            key={idx}
            className="rounded-md shadow overflow-hidden bg-primary-500 flex flex-col justify-between"
          >
            <figure className="aspect-w-16 aspect-h-10">
              <img src={p.image} className="object-fill w-full h-full" />
            </figure>
            <div className="p-6">
              <h3 className="title h5 text-lg font-medium hover:text-indigo-600 duration-500 ease-in-out">
                {p.title}
              </h3>
              <p className="text-slate-400 mt-3 line-clamp-3 hover:line-clamp-none">
                {p.description}
              </p>
            </div>
            <div className="flex justify-between p-2 items-center">
              <span className="font-bold">{p.price} د.ل</span>
              <button className="font-normal bg-brand-500 hover:bg-brand-700 text-white duration-500 ease-in-out py-2 px-4 rounded">
                اضافة للعربة
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
export function Products({
  view = "grid",
  products,
}: {
  view: "grid" | "list";
  products: Product[];
}) {
  return view === "grid" ? (
    <ProductGrid products={products} />
  ) : (
    <ProductList products={products} />
  );
}
