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
          <Dialog.Overlay className="fixed inset-0 backdrop-blur-sm">
            <Dialog.Content className="sticky top-8 p-8 min-w-md">
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
      <section className="flex gap-4 justify-center items-center my-4 mx-4 max-w-sm text-sm rounded-lg sm:justify-between md:px-2 md:mx-auto md:max-w-xl bg-primary-500">
        <div className="flex gap-1 items-center">
          <div className="py-1 px-3 my-1 rounded-md bg-primary-900">
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
          <div className="py-1 px-3 my-1 rounded-md bg-primary-900">
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
