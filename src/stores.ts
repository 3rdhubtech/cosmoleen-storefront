import { proxy, subscribe } from "valtio";
type MainStore = {
  view: "grid" | "list";
};
export const mainStore = proxy<MainStore>(
  JSON.parse(localStorage.getItem("main") as string) || {
    view: "grid",
  }
);
subscribe(mainStore, () => {
  localStorage.setItem("main", JSON.stringify(mainStore));
});
export function changeView(view: "grid" | "list") {
  mainStore.view = view;
}
