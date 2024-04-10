import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import UsersList from "./UsersList";
import FindUserPage from "./FindUserPage.jsx"
import ChatSec from "./ChatSec";
import InitialPage from "./InitialPage";
import SelectedChat from "../context/SelectedChat.jsx";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider.jsx";
import { SocketContextProvider } from "../context/SocketContext.jsx";
import { useMenuContext } from "../context/MenuContext.jsx";
import MenuBar from "./MenuBar.jsx";
import { AuthContextProvider } from "../context/AuthContext.jsx";
import useScreen from "../Hooks/useScreen.js";


const Chats = () => {
  const [selectedId, setSelectedId] = useState();
  const [openWindow, setOpenWindow] = useState(false);
  const [notificationPage, setNotificationPage] = useState(false)
  const { user } = useLoggedInUser();
  const { menuBar } = useMenuContext();
  const screenWidth = useScreen();
  // console.log("menu ", menuBar)
  // console.log("context : ", user)
  // console.log("selectedId : ", selectedId)

  return (

    <AuthContextProvider>
      {/* {screenWidth < 767 ? (
        <div className="px-3 py-3 h-screen flex flex-col justify-center items-center">
          <h1 className="text-center italic text-xl">
            "Hope one day I will build <span className="text-[#6c44fa] font-semibold">ChatWave</span> for mobile as well."
          </h1>
          <h2 className="mt-2 text-gray-500 text-center">Till then enjoy with web services💜</h2>
        </div>
      )
        : ( */}
          <SocketContextProvider>
            <SelectedChat.Provider value={{ openWindow, setOpenWindow, notificationPage, setNotificationPage, selectedId, setSelectedId }}>
              {!user && <Navigate to="/" />}
              <div className="transition delay-150 ease-linear w-full h-full flex overflow-hidden">
                {openWindow && <FindUserPage />}
                {menuBar ? <MenuBar /> : <UsersList />}
                <div className="hidden md:block w-full md:w-2/3 h-full bg-[#E8E8F9]">
                  {selectedId ? <SelectedChat.Provider value={{ openWindow, setOpenWindow, notificationPage, setNotificationPage, selectedId, setSelectedId }}><ChatSec /> </SelectedChat.Provider>: <InitialPage />}
                </div>
              </div>
            </SelectedChat.Provider>
          </SocketContextProvider>
        {/* )
      } */}
    </AuthContextProvider>


  );
};

export default Chats;
