import { pageAction, pageState } from "@/stores";
import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useSnapshot } from "valtio";
import { Input } from "./Input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";

type Category = {
  id: number;
  name: string;
};
async function getCategories(): Promise<Category[]> {
  return fetch("/api/categories").then((r) => r.json());
}

export function Arranges() {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => {
    setOpen((open) => (open = !open));
  }, [open]);
  const snap = useSnapshot(pageState);
  const query = useQuery(["categories"], getCategories);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed backdrop-blur-sm">
            <Dialog.Content className="min-w-md p-8 sticky top-8">
              <div className="bg-primary-500">
                <Input
                  defaultValue={snap.name}
                  onKeyDown={(e) => {
                    pageAction.setName(e, toggle);
                  }}
                />
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <section className="text-sm flex my-4 items-center gap-4  bg-primary-500 max-w-sm md:max-w-xl mx-4 md:mx-auto rounded-lg justify-center sm:justify-between md:px-2">
        <div className="flex gap-1 items-center">
          <div className="bg-primary-900 my-1 px-3 py-1 rounded-md">
            <Select dir="rtl" onValueChange={pageAction.setCategory}>
              <SelectTrigger aria-label="category">
                <span>التصنيف: </span>
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0" aria-selected>
                  الكل
                </SelectItem>
                {query?.data?.map((c) => (
                  <SelectItem value={`${c.id}`} key={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-primary-900 my-1 px-3 py-1 rounded-md">
            <Select dir="rtl" onValueChange={pageAction.setPriceOrder}>
              <SelectTrigger aria-label="price">
                <span>ترتيب:</span>
                <SelectValue placeholder="السعر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">مرتفع إلى منخفض</SelectItem>
                <SelectItem value="-1">منخفض إلى مرتفع</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <button onClick={toggle} className="p-1" aria-label="button">
          <SearchIcon className="w-5 h-5" />
        </button>
      </section>
    </>
  );
}
