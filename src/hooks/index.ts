import { useQuery } from "@tanstack/react-query";

async function getStoreData() {
  return fetch("/api/store").then((r) => r.json());
}
export function useStore() {
  const { data } = useQuery(["store"], getStoreData);
  return data?.data;
}
