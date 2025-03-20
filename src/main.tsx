import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ENV } from "./utils/api.ts";
import { ROUTES } from "./constants/routes.ts";
import "virtual:uno.css";

const isZaloMiniApp = false;

createRoot(document.getElementById("app")!).render(
  <BrowserRouter
    basename={isZaloMiniApp ? `/zapps/${ENV.VITE_APP_ID}` : ROUTES.BASE}
  >
    <App />
  </BrowserRouter>
);
