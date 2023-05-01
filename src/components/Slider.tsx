import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactElement, ReactNode, useCallback, useState } from "react";

export default function Slider({
  children,
}: {
  children: ReactElement<typeof Slider.Item>[];
}) {
  const [counter, setCounter] = useState(0);

  const len = children.length;
  const nextSlide = useCallback(() => {
    if (counter < len - 1) setCounter((counter) => (counter += 1));
    else setCounter(0);
  }, [counter]);
  const prevSlide = useCallback(() => {
    if (counter > 0) setCounter((counter) => (counter -= 1));
    else setCounter(len - 1);
  }, [counter]);

  return (
    <div className="grid grid-rows-1 lg:grid-cols-3">
      <div className="relative max-w-min">
        <button
          className="absolute bottom-1/2 py-2 bg-gray-400 translate-y-1/2 hover:bg-gray-300 rounded-e-md"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="flex overflow-x-hidden w-64 rounded-2xl">
          {children[counter]}
        </div>
        <button
          className="absolute right-0 bottom-1/2 py-2 bg-gray-400 translate-y-1/2 hover:bg-gray-300 rounded-s-md"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
function SliderItem({ children }: { children: ReactNode; key?: any }) {
  return (
    <div className="box-content flex flex-none w-full snap-start">
      {children}
    </div>
  );
}
Slider.Item = SliderItem;
