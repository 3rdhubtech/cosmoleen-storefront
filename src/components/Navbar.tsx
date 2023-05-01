import { useStore } from "@/hooks";
import logo from "../assets/logo.png";

export default function Navbar() {
  const store = useStore();
  return (
    <header className="flex sticky top-0 z-10 justify-between items-center p-2 w-full h-12 bg-primary-500">
      <nav className="flex gap-2 items-center">
        <div className="flex gap-2 items-center h-9 max-w-[9rem]">
          <img src={`/store_logo/${store?.logo}`} className="p-1 w-full" />
        </div>
        <h1 className="flex flex-col text-xl font-bold">
          {store?.name}
          <span className="hidden text-xs md:inline-block">
            {store?.state} {store?.country}
          </span>
        </h1>
      </nav>
    </header>
  );
}
