import { proxy } from "valtio";
export const mainStore = proxy({
  view: "grid",
});
export function changeView(view: "grid" | "list") {
  mainStore.view = view;
}
