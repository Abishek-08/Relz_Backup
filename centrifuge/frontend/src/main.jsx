import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { SyncStatusProvider } from "./context/SyncStatusProvider";
import { AuthProvider } from "./routes/AuthContext";
import App from "./App";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthProvider>
        <SyncStatusProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SyncStatusProvider>
      </AuthProvider>
    </PersistGate>
  </Provider>
);

registerSW({
  onNeedRefresh() {
    if (confirm("New update available. Reload?")) location.reload();
  },
});
