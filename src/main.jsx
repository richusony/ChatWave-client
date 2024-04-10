import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Chats from "./components/Chats.jsx";
import ChatSec from "./components/ChatSec.jsx";
import LoginSignUp from "./components/LoginSignUp.jsx";
import { MenuContextProvider } from "./context/MenuContext.jsx";
import LoggedInUserCnxtProvider from "./context/LoggedInUserCnxtProvider.jsx";
import "./index.css";
import { SocketContextProvider } from "./context/SocketContext.jsx";

const chatRoute = createBrowserRouter([
  {
    path: "/",
    element: <LoggedInUserCnxtProvider><LoginSignUp /></LoggedInUserCnxtProvider>,
  },
  {
    path: "/chats",
    element: <MenuContextProvider><LoggedInUserCnxtProvider><Chats /></LoggedInUserCnxtProvider></MenuContextProvider>
  },
  {
    path: "/login",
    element: <LoggedInUserCnxtProvider><LoginSignUp /></LoggedInUserCnxtProvider>,
  },
  {
    path: "/signup",
    element: <LoggedInUserCnxtProvider><LoginSignUp /></LoggedInUserCnxtProvider>,
  },
  {
    path: "/mobile/chats",
    element: <LoggedInUserCnxtProvider><SocketContextProvider><ChatSec /></SocketContextProvider></LoggedInUserCnxtProvider>
  },
  // Add the wildcard route for redirection
  {
    path: "*", // Matches any path not explicitly defined above
    element: <Chats />, 
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={chatRoute} />
  </React.StrictMode>
);
