import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Arranges } from "./components/Arranges";
import CartSide from "./components/CartSide";
import Navbar from "./components/Navbar";
import { Products } from "./components/Products";

function App() {
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
      <Products />

      <CartSide />
    </>
  );
}

export default App;
