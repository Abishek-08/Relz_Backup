import { Toaster } from "sonner";
import { SyncBanner } from "./components/Pwa/SyncBanner";
import CentrifugeProvider from "./centrifuge/CentrifugeProvider";
import { useAuth } from "./routes/AuthContext";
import AppRouter from "./routes/AppRouter";

const App = () => {
  const { isAuthenticated } = useAuth();

  console.log("from-app--isAuth: ", isAuthenticated);

  return (
    <div>
      <Toaster richColors position="top-center" />
      <SyncBanner />

      {/* ALWAYS mounted */}
      <CentrifugeProvider isAuth={isAuthenticated} />

      <AppRouter />
    </div>
  );
};

export default App;
