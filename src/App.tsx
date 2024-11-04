
import { BrowserRouter } from "react-router-dom";
import RouteMain from "./routes/RouteMain";
import { LoginProvider } from "./context/Context.provider";
import 'antd/dist/reset.css'; // Asegúrate de importar los estilos de Ant Design
import { ConfigProvider } from "antd";

function App() {

  return (
    <BrowserRouter>
    <LoginProvider>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0cca5d', // Cambia este valor al color que desees
          colorText: '#000000',
        },
      }}
    >
      <RouteMain></RouteMain>
      </ConfigProvider>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
