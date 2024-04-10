import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import UsersList from "./UsersList";
import FindUserPage from "./FindUserPage.jsx"
import ChatSec from "./ChatSec";
import InitialPage from "./InitialPage";
import { SelectedChatProvider, useSelectedChat } from "../context/SelectedChat.jsx";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider.jsx";
import { SocketContextProvider } from "../context/SocketContext.jsx";
import { useMenuContext } from "../context/MenuContext.jsx";
import MenuBar from "./MenuBar.jsx";
import { AuthContextProvider } from "../context/AuthContext.jsx";
import useScreen from "../Hooks/useScreen.js";


const Chats = () => {

  const { user } = useLoggedInUser();
  const { menuBar } = useMenuContext();
  const { openWindow, selectedId } = useSelectedChat();
  const screenWidth = useScreen();

  // console.log("menu ", menuBar)
  // console.log("context : ", user)
  // console.log("selectedId : ", selectedId)

  return (
    <AuthContextProvider>
      <SocketContextProvider>

        {!user && <Navigate to="/" />}
        <div className="transition delay-150 ease-linear w-full h-full flex overflow-hidden">
          {openWindow && <FindUserPage />}

          {screenWidth < 768 ? (<>
            {
              menuBar ?
                <MenuBar /> :
                selectedId == null ?
                  <UsersList /> :
                  <div className={`w-full md:w-2/3 h-full bg-[#E8E8F9]`}>
                    <ChatSec />
                  </div>
            }
          </>
          )
            :
            (
              <>{menuBar ? <MenuBar /> : <UsersList />}
                <div className={`hidden md:block w-full md:w-2/3 h-full bg-[#E8E8F9]`}>
                  {selectedId ? <ChatSec /> : <InitialPage />}
                </div>
              </>)
          }


        </div>
      </SocketContextProvider>
    </AuthContextProvider>
  );
};

export default Chats;
