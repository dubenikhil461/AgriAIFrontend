import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import App from "./App";
import "./style/app.css";

// 1. Create a query client
const queryClient = new QueryClient();

// 2. Create a persister (localStorage or sessionStorage)
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

// 3. Wrap your app with PersistQueryClientProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <App />
      </PersistQueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
