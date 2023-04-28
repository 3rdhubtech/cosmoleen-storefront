import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Arranges } from "./components/Arranges";
import Navbar from "./components/Navbar";
import loadable from "@loadable/component";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "./hooks";

const Products = loadable(() => import("./components/Products"));
const CartSide = loadable(() => import("./components/CartSide"));

function App() {
  const store = useStore();
  return (
    <>
      <Helmet>
        <title>{store?.name}</title>
        <meta name="description" content={store?.tagline} />
      </Helmet>
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
