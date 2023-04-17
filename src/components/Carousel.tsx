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
        className="flex transition-transform ease-out duration-500"
        style={{ x: `${current * 100}%` }}
      >
        {children}
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
          onClick={prev}
        >
          <ChevronRight size={25} />
        </button>
        <button
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
          onClick={next}
        >
          <ChevronLeft size={25} />
        </button>
      </div>
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
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
