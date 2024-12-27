import React, { useEffect, useState } from "react"; // Importa useState
import RouteAdmin from "./RouteAdmin";
import RouteDefault from "./RouteDefault";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/Context.provider";
import { getFromLocalStorage } from "../js/functions";
import { Spin } from "antd";

const RouteMain: React.FC = () => {
  const { login, isLoggedIn } = useLogin();
  const navigator = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAuthentication = () => {
      const userStorage = getFromLocalStorage();
      if (userStorage) {
        login();
        navigator("/admin");
      }
      setLoading(false);
    };

    checkUserAuthentication();
  }, [login]);

  if (loading) {
    return <div className="centered">
      <Spin />
    </div>;
  }

  return isLoggedIn ? <RouteAdmin /> : <RouteDefault />;
};

export default RouteMain;
