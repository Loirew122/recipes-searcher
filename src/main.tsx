import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import './index.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error("Не найден корневой элемент #root");

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>
)