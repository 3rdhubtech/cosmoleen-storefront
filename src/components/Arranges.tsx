import * as Dialog from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  LayoutGridIcon,
  LayoutListIcon,
  SearchIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useSnapshot } from "valtio";
import { changeView, mainStore } from "../stores";
import Dropdown from "./Dropdown";
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
  const snap = useSnapshot(mainStore);
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => {
    setOpen((open) => (open = !open));
  }, [open]);
  const query = useQuery(["categories"], getCategories);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed backdrop-blur-sm">
            <Dialog.Content className="min-w-md p-8">
              <div className="bg-primary-500">
                <Input />
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <section className="text-sm flex my-4 items-center gap-4  bg-primary-500 max-w-sm md:max-w-xl mx-4 md:mx-auto rounded-lg justify-center sm:justify-between md:px-2">
        <div className="flex gap-2 items-center">
          <div className="bg-[#111B21] my-1 px-3 py-1 flex items-center gap-1  rounded-md">
            <span className="hidden md:block">التصنيف: </span>

            <Select dir="rtl">
              <SelectTrigger>
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                {query?.data?.map((c) => (
                  <SelectItem value={`${c.id}`} key={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="bg-[#111B21] px-3 py-1 flex items-center gap-1  rounded-md">
            <span className="hidden md:block"> ترتيب حسب: </span>
            <span>سعر</span>
            <Dropdown>
              <Dropdown.Button>
                <ChevronDownIcon />
              </Dropdown.Button>
              <Dropdown.Menu>
                <Dropdown.MenuItem>مرتفع إلى منخفض</Dropdown.MenuItem>
                <Dropdown.MenuItem>منخفض إلى مرتفع </Dropdown.MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <span className="hidden md:block">عرض بواسطة</span>
          <button
            onClick={() => changeView("list")}
            disabled={snap.view === "list"}
            className="p-1 disabled:bg-primary-700 rounded"
          >
            <LayoutListIcon />
          </button>
          <button
            onClick={() => changeView("grid")}
            disabled={snap.view === "grid"}
            className="p-1 disabled:bg-primary-700 rounded"
          >
            <LayoutGridIcon />
          </button>
          <button onClick={toggle} className="p-1">
            <SearchIcon />
          </button>
        </div>
      </section>
    </>
  );
}
