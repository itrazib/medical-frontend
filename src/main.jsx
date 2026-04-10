import { StrictMode } from "react";


import { createRoot } from 'react-dom/client'


import "./index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AuthProvider from "./context/AuthProvider.jsx";
import { router } from "./Router/Router.jsx";
import { RouterProvider } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} >
      </RouterProvider>
    </AuthProvider>
  </StrictMode>
);
