import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import logo from "../assets/logo.png";
import { Input } from "./Input";
import SearchIcon from "./SearchIcon";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const toggle = useCallback(
    () => setShowSearch((s) => (s = !s)),
    [showSearch]
  );
  return (
    <div>
      <header className="h-12 w-full bg-primary-500 flex items-center justify-between p-2">
        <nav className="flex gap-2 items-center">
          <div className="bg-brand-500 h-9 max-w-[9rem] inline-block flex items-center">
            <img src={logo} className="w-full p-1" />
          </div>
        </nav>
        <button onClick={toggle}>
          <SearchIcon />
        </button>
      </header>
      <AnimatePresence>
        {showSearch && (
          <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "linear", duration: 1 }}
            exit={{ opacity: 0 }}
            className="h-12 w-full bg-primary-700 gap-2 flex items-center justify-between p-2 backdrop-blur"
          >
            <Input />
            <button onClick={toggle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#8696A0"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </motion.header>
        )}
      </AnimatePresence>
    </div>
  );
}
