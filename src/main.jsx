import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Chats from "./components/Chats.jsx";
import LoginSignUp from "./components/LoginSignUp.jsx";
import ChatSec from "./components/ChatSec.jsx";
import LoggedInUserCnxtProvider from "./context/LoggedInUserCnxtProvider.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import FindUserPage from "./components/FindUserPage.jsx";
import { MenuContextProvider } from "./context/MenuContext.jsx";
// import UserContextProvider from "./context/UserContextProvider.jsx";
// import { ThemeProvdier } from "./context/theme.js";

const chatRoute = createBrowserRouter([
  {
    path: "/",
    element:<LoggedInUserCnxtProvider><LoginSignUp /></LoggedInUserCnxtProvider> ,
  },
  {
    path: "/chats",
    element: <MenuContextProvider><LoggedInUserCnxtProvider><Chats /></LoggedInUserCnxtProvider></MenuContextProvider>,
    children: [
      {
        path: ":userId", // Use ":userId" for dynamic user IDs
        element: <MenuContextProvider><LoggedInUserCnxtProvider><Chats /></LoggedInUserCnxtProvider></MenuContextProvider>,
      },
    ],
  },
  {
    path: "/mobile/chats/:userId",
    element: <LoggedInUserCnxtProvider><ChatSec /></LoggedInUserCnxtProvider>,
  },
  {
    path: "/login",
    element: <LoggedInUserCnxtProvider><LoginSignUp /></LoggedInUserCnxtProvider>,
  },
  {
    path: "/signup",
    element: <LoggedInUserCnxtProvider><LoginSignUp /></LoggedInUserCnxtProvider>,
  },
  // {
  //   path: "/find",
  //   element: <LoggedInUserCnxtProvider><FindUserPage /></LoggedInUserCnxtProvider>,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <RouterProvider router={chatRoute} />
  </React.StrictMode>
);
