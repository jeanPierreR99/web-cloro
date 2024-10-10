import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Spin } from "antd";
import logoDRVCS from "../../assets/logo-drvcs.png";
import appFirebase from "../../js/credentials";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { saveToLocalStorage } from "../../js/functions";
import { useLogin } from "../../context/Context.provider";
import { useNavigate } from "react-router-dom";
const db = getFirestore(appFirebase);

const Login = () => {
  const [error, setError] = useState(false);
  const [load, setLoad] = useState(false);
  const { login } = useLogin();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoad(true);
    try {
      const userQuery = query(
        collection(db, "user_admin"),
        where("user", "==", values.username),
        where("password", "==", values.password)
      );

      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const dataStoraga = {
            user: data.name,
            role: Date(),
          };
          saveToLocalStorage(dataStoraga);
          navigate("/admin");
          login();
        });
      } else {
        setLoad(false);
        setError(true);
        console.log("No se encontraron usuarios con esas credenciales.");
      }
    } catch (error) {
      setLoad(false);
      setError(true);
      console.error("Error al obtener datos: ", error);
    }
  };

  return (
    <center className="content-login">
      <div className="img-absolute"></div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <img src={logoDRVCS} className="img-logo-horizontal" alt="" />
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Por favor ingrese sus usuario!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            className="input-form"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor ingrese su contraseña!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            className="input-form"
          />
        </Form.Item>
        {error && (
          <p style={{ color: "red", opacity: ".7" }}>
            Credenciales Incorrectas.
          </p>
        )}
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Recordarme</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Olvidaste tu contraseña
          </a>
        </Form.Item>

        <Form.Item>
          <Spin spinning={load}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Ingresar
            </Button>
          </Spin>
        </Form.Item>
      </Form>
    </center>
  );
};
export default Login;
