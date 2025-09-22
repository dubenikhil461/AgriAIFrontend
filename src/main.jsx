import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./style/app.css";

// 1. Create a query client
const queryClient = new QueryClient();

// 2. Create a persister (localStorage or sessionStorage)
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="763951318228-2lc507uh46rc4f9tdm7gmf185evu9jgh.apps.googleusercontent.com">
      <BrowserRouter>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister }}
        >
          <App />
        </PersistQueryClientProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
