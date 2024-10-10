
import { BrowserRouter } from "react-router-dom";
import RouteMain from "./routes/RouteMain";
import { LoginProvider } from "./context/Context.provider";

function App() {

  return (
    <BrowserRouter>
    <LoginProvider>
      <RouteMain></RouteMain>
      </LoginProvider>
    </BrowserRouter>
  );
}

export default App;
