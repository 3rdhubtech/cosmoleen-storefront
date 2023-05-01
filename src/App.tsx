import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Arranges } from "./components/Arranges";
import Navbar from "./components/Navbar";
import loadable from "@loadable/component";

const Products = loadable(() => import("./components/Products"));
const CartSide = loadable(() => import("./components/CartSide"));
const Meta = loadable(() => import("./components/Meta"));
function App() {
  return (
    <>
      <Meta />
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
      <Products />

      <CartSide />
    </>
  );
}

export default App;
