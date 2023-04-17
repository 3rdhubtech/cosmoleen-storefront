import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import App from "./App";
import "./index.css";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * (1000 * 60 * 60 * 24),
      cacheTime: 3 * (1000 * 60 * 60 * 24),
    },
  },
});
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <App />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
