import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home";
import AppPage from "./pages/app";
import DashboardPage from "./pages/dashboard";
import CreateAppPage from "./pages/create-app";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
  },
  {
    path: "/store",
    element: <HomePage />,
  },
  {
    path: "/create-app",
    element: <CreateAppPage />,
  },
  {
    path: "/apps/install/:id",
    element: <AppPage install />,
  },
  {
    path: "/apps/:id",
    element: <AppPage />,
  },
]);
