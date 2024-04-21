import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Chats from "./components/Chats.jsx";
import LoginSignUp from "./components/LoginSignUp.jsx";
import { MenuContextProvider } from "./context/MenuContext.jsx";
import { SelectedChatProvider } from "./context/SelectedChat.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoggedInUserCnxtProvider from "./context/LoggedInUserCnxtProvider.jsx";

const chatRoute = createBrowserRouter([
  {
    path: "/",
    element: <LoggedInUserCnxtProvider><LoginSignUp /></LoggedInUserCnxtProvider>,
  },
  {
    path: "/chats",
    element: <MenuContextProvider><LoggedInUserCnxtProvider><SelectedChatProvider><Chats /></SelectedChatProvider></LoggedInUserCnxtProvider></MenuContextProvider>
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
  //   path: "/mobile/chats",
  //   element: <AuthContextProvider><LoggedInUserCnxtProvider><SelectedChatProvider><SocketContextProvider><ChatSec /></SocketContextProvider></SelectedChatProvider></LoggedInUserCnxtProvider></AuthContextProvider>
  // },
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
