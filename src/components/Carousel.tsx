import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useState } from "react";
import { useComputed, useSignal } from "@preact/signals-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
export default function Carousel({
  children,
  className = "",
}: {
  children: ReactNode[];
  className?: any;
}) {
  const [current, setCurrent] = useState(0);
  const next = () =>
    setCurrent((current) =>
      current === children.length - 1 ? 0 : current + 1
    );

  const prev = () =>
    setCurrent((current) =>
      current === 0 ? children.length - 1 : current - 1
    );

  return (
    <div className={cn("overflow-hidden relative rounded-xl", className)}>
      <motion.div
        className="flex transition-transform duration-500 ease-out"
        style={{ x: `${current * 100}%` }}
      >
        {children}
      </motion.div>
      <div className="flex absolute inset-0 justify-between items-center p-4">
        <button
          className="p-1 text-gray-800 rounded-full shadow hover:bg-white bg-white/80"
          onClick={prev}
        >
          <ChevronRight size={25} />
        </button>
        <button
          className="p-1 text-gray-800 rounded-full shadow hover:bg-white bg-white/80"
          onClick={next}
        >
          <ChevronLeft size={25} />
        </button>
      </div>
      <div className="absolute right-0 left-0 bottom-4">
        <div className="flex gap-2 justify-center items-center">
          {children.map((_, i) => {
            return (
              <button
                onClick={() => setCurrent(i)}
                className={cn("transition-all w-3 h-3 bg-white rounded-full", {
                  "p-2": current === i,
                  "bg-opacity-50": current !== i,
                })}
                key={i}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
