import CreateAppPage from "@/pages/create-app";
import DashboardPage from "@/pages/dashboard";
import HomePage from "@/pages/home";

const CONFIG = {
  SIDEBAR_ITEMS: [
    {
      path: "/",
      title: "Dashboard",
      icon: "🏡",
      component: DashboardPage,
    },
    {
      path: "/store",
      title: "Store",
      icon: "⭐️",
      component: HomePage,
    },
    {
      path: "/create-app",
      title: "Create App",
      icon: "🪄",
      component: CreateAppPage,
    },
  ],
  WINDOW_LAYOUTS: {
    grid: {
      positions: [
        [0, 0, 0] as [number, number, number],
        [5, 0, 0] as [number, number, number],
        [-5, 0, 0] as [number, number, number],
        [0, 3, 0] as [number, number, number],
        [5, 3, 0] as [number, number, number],
        [-5, 3, 0] as [number, number, number],
      ],
    },
    minimized: {
      positions: [
        [-8, -5, 0] as [number, number, number],
        [-6, -5, 0] as [number, number, number],
        [-4, -5, 0] as [number, number, number],
        [-2, -5, 0] as [number, number, number],
        [0, -5, 0] as [number, number, number],
        [2, -5, 0] as [number, number, number],
      ],
    },
  },
};

export default CONFIG;
