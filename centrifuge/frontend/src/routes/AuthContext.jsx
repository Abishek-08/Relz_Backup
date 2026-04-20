import { createContext, useContext, useState } from "react";
import { decryptSession, encryptSession } from "../utils/SessionCrypto";
import { disconnectCentrifuge } from "../centrifuge/centrifugeManager";
import { store, persistor } from "../redux/store";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") &&
      decryptSession(localStorage.getItem("userType"))
      ? true
      : false,
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("token") &&
      decryptSession(localStorage.getItem("userType"))
      ? decryptSession(localStorage.getItem("userType"))
      : null,
  );

  const doLogin = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", encryptSession(role).toString());
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    disconnectCentrifuge();
    localStorage.clear();
    store.dispatch({ type: "LOGOUT" });
    persistor.purge();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, doLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
