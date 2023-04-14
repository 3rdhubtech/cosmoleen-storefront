import { useQuery } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { useSnapshot } from "valtio";
import { Arranges } from "./components/Arranges";
import CartSide from "./components/CartSide";
import Navbar from "./components/Navbar";
import { Products } from "./components/Products";
import { mainStore } from "./stores";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const snap = useSnapshot(mainStore);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Navbar />
      <Arranges />
      <Products view={snap.view} />

      <CartSide />
    </>
  );
}

export default App;
