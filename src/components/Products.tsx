type Product = {
  name: string;
  price: string;
  description: string;
  photo: string;
};

export function ProductList({ products }: { products: Product[] }) {
  return (
    <div className="container mx-auto">
      <section className="grid grid-cols-1 gap-4">
        {products.map((p, idx) => (
          <article
            key={idx}
            className="rounded-md shadow overflow-hidden bg-primary-500 grid grid-rows-1 grid-cols-3"
          >
            <figure className="aspect-square">
              <img src={p.photo} className=" object-cover w-full h-full" />
            </figure>
            <div className="p-6 grow">
              <h3 className="title h5 text-lg font-medium hover:text-indigo-600 duration-500 ease-in-out">
                {p.name}
              </h3>
              <p className="text-slate-400 mt-3 line-clamp-3 hover:line-clamp-none">
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

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="container mx-auto">
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p, idx) => (
          <article
            key={idx}
            className="rounded-md shadow overflow-hidden bg-primary-500 flex flex-col"
          >
            <figure className="aspect-video">
              <img src={p.photo} className=" object-cover w-full h-full" />
            </figure>
            <div className="p-6">
              <h3 className="title h5 text-lg font-medium hover:text-indigo-600 duration-500 ease-in-out">
                {p.name}
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
