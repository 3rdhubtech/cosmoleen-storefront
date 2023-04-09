import { useCallback, useState } from "react";
import CartIcon from "./CartIcon";
import MinusSignIcon from "./MinusSignIcon";
import PlusSignIcon from "./PlusSignIcon";
import TrashIcon from "./TrashIcon";

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
          className="fixed top-0 right-0 w-full h-full z-20 grid gap-2 place-items-center backdrop-blur shadow-sm"
          onClick={toggleCart}
        >
          <div
            className="grid grid-rows-3 grid-cols-1 px-8 max-w-md bg-primary-700 h-full place-items-center justify-self-end"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-primary-500 rounded">
              <h4 className="font-semibold">عربة التسوق</h4>
              <h5 className="text-sm">المجموع الفرعي</h5>
              <div className="text-xs">
                <div className="flex gap-2 justify-center items-center">
                  <span>نظارات</span>
                  <MinusSignIcon />
                  <span>12</span>
                  <PlusSignIcon />
                  <span>180</span>
                  <TrashIcon />
                </div>
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </>
  );
}
