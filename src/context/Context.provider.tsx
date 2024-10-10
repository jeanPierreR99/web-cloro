import { createContext, ReactNode, useContext, useState } from "react";

interface LoginContextType {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
  }
  
  const LoginContext = createContext<LoginContextType | undefined>(undefined);

  export const LoginProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  
    const login = () => {
      setIsLoggedIn(true);
    };
  
    const logout = () => {
      setIsLoggedIn(false);
    };
  
    return (
      <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
        {children}
      </LoginContext.Provider>
    );
  };

  export const useLogin = (): LoginContextType => {
    const context = useContext(LoginContext);
    if (!context) {
      throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
  };