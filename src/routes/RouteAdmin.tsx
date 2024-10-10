import { useState, useEffect } from "react";
import {
  DeploymentUnitOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RotateRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import { Routes, Route, useNavigate } from "react-router-dom";
import logoDRVCS from "../assets/logo-drvcs.png";
import Home from "../page/admin/Home";
import User from "../page/admin/User";
import PopulateCenter from "../page/admin/PopulateCenter";
import Monitoring from "../page/admin/Monitoring";
import { useLogin } from "../context/Context.provider";
const { Header, Sider, Content } = Layout;

function RouteAdmin() {
  const navigate = useNavigate();
  const { logout } = useLogin();
  const [collapsed, setCollapsed] = useState(false);
  const [_user, setUser] = useState({});

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const closeSession = () => {
    localStorage.clear();
    navigate("/")
    logout();
  };

  const getStorage = () => {
    const objStorage = localStorage.getItem("user");
    if (objStorage) {
      const objParse = JSON.parse(objStorage);
      console.log(objParse);
      setUser(objParse);
    }
  };
  useEffect(() => {
    getStorage();
  }, []);

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "white", minHeight: "100vh" }}
      >
        <div
          className="content-desc"
          style={{ display: collapsed ? "none" : "" }}
        >
          <img src={logoDRVCS} alt="logo" className="image-logo" />
          <span className="name-role">Panel Adminsitrativo</span>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ background: "white", height: "auto" }}
          items={[
            {
              key: "1",
              icon: <HomeOutlined />,
              label: "Inicio",
              onClick: () => {
                navigate("/admin");
              },
            },
            {
              key: "3",
              icon: <DeploymentUnitOutlined />,
              label: "Centros Poblados",
              onClick: () => {
                navigate("/admin/populate-center");
              },
            },
            {
              key: "4",
              icon: <UserOutlined />,
              label: "Gestores",
              onClick: () => {
                navigate("/admin/user");
              },
            },
            {
              key: "8",
              icon: <RotateRightOutlined />,
              label: "Monitoreos",
              onClick: () => {
                navigate("/admin/monitoring");
              },
            },
            {
              key: "9",
              icon: <LogoutOutlined />,
              label: "Cerrar sesión",
              style: { color: "red", opacity: ".8" },
              onClick: () => {
                closeSession();
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "white",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route path="/admin" element={<Home />} />
            <Route path="/admin/user" element={<User />} />
            <Route path="/admin/monitoring" element={<Monitoring />} />
            <Route path="/admin/populate-center" element={<PopulateCenter />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}
export default RouteAdmin;
