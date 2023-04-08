import { useSnapshot } from "valtio";
import { changeView, mainStore } from "../stores";
import Dropdown from "./Dropdown";
function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 28"
      fill="none"
    >
      <path
        fill="#00A884"
        d="M14 23H0v2h14v-2Zm6.83 1 2.58 2.58L22 28l-4-4 4-4 1.42 1.41L20.83 24ZM14 13H0v2h14v-2Zm6.83 1 2.58 2.58L22 18l-4-4 4-4 1.42 1.41L20.83 14ZM14 3H0v2h14V3Zm6.83 1 2.58 2.58L22 8l-4-4 4-4 1.42 1.41L20.83 4Z"
      />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="8" height="8" rx="1" fill="#00A884" />
      <rect x="12" width="8" height="8" rx="1" fill="#00A884" />
      <rect x="12" y="12" width="8" height="8" rx="1" fill="#00A884" />
      <rect y="12" width="8" height="8" rx="1" fill="#00A884" />
    </svg>
  );
}
function ArrowDownList() {
  return (
    <svg
      width="10"
      height="5"
      viewBox="0 0 10 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0L5 5L10 0H0Z" fill="white" />
    </svg>
  );
}

export function Arranges() {
  const snap = useSnapshot(mainStore);
  return (
    <section className="text-sm flex my-4 items-center gap-4  bg-primary-500 max-w-sm md:max-w-lg mx-4 md:mx-auto rounded-lg justify-center sm:justify-between md:px-2">
      <div className="flex gap-2 items-center">
        <div className="bg-[#111B21] my-1 px-3 py-1 flex items-center gap-1  rounded-md">
          <span className="hidden md:block">التصنيف: </span>
          <span>نظارات</span>
        </div>
        <div className="bg-[#111B21] px-3 py-1 flex items-center gap-1  rounded-md">
          <span className="hidden md:block"> ترتيب حسب: </span>
          <span>سعر</span>
          <Dropdown>
            <Dropdown.Button>
              <ArrowDownList />
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
        >
          <ListIcon />
        </button>
        <button
          onClick={() => changeView("grid")}
          disabled={snap.view === "grid"}
        >
          <GridIcon />
        </button>
      </div>
    </section>
  );
}
