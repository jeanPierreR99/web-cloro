import React from "react";
import RouteAdmin from "./RouteAdmin";
import RouteDefault from "./RouteDefault";
const RouteMain: React.FC = () => {
  const isLogin: boolean = true;
  return isLogin ? <RouteAdmin /> : <RouteDefault />;
};

export default RouteMain;
