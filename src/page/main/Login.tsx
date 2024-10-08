import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
// import { useNavigate } from "react-router-dom";
import logoDRVCS from "../../assets/logo-drvcs.png";

const Login = () => {
  const [error, _setError] = useState(false);
  const onFinish = (values: any) => {
    console.log(values);
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
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Ingresar
          </Button>
        </Form.Item>
      </Form>
    </center>
  );
};
export default Login;
