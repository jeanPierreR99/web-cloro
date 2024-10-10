import React, { useEffect } from "react";
import RouteAdmin from "./RouteAdmin";
import RouteDefault from "./RouteDefault";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/Context.provider";
import { getFromLocalStorage } from "../js/functions";
const RouteMain: React.FC = () => {
  const { login, isLoggedIn } = useLogin();
  const navigator = useNavigate();
  useEffect(() => {
    const userStorage = getFromLocalStorage();
    if (userStorage) {
      login();
      navigator("/admin");
    }
  }, []);
  
  return isLoggedIn ? <RouteAdmin /> : <RouteDefault />;
};

export default RouteMain;
