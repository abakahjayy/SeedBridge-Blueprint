import { createContext, useContext, useEffect, useState } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react/custom-fetch";
const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const storedToken = localStorage.getItem("seedbridge_token");
    const storedUser = localStorage.getItem("seedbridge_user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setAuthTokenGetter(() => storedToken);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("seedbridge_token");
        localStorage.removeItem("seedbridge_user");
      }
    }
    setIsLoading(false);
  }, []);
  const login = (newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    localStorage.setItem("seedbridge_token", newToken);
    localStorage.setItem("seedbridge_user", JSON.stringify(newUser));
    setAuthTokenGetter(() => newToken);
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("seedbridge_token");
    localStorage.removeItem("seedbridge_user");
    setAuthTokenGetter(null);
  };
  return <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>;
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
export {
  AuthProvider,
  useAuth
};
