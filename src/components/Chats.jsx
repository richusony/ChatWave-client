import ChatSec from "./ChatSec";
import UsersList from "./UsersList";
import MenuBar from "./MenuBar.jsx";
import NewGroup from "./NewGroup.jsx";
import InitialPage from "./InitialPage";
import GroupList from "./GroupList.jsx";
import GroupChat from "./GroupChat.jsx";
import { Navigate } from "react-router-dom";
import useScreen from "../Hooks/useScreen.js";
import FindUserPage from "./FindUserPage.jsx";
import NotificationPage from "./NotificationPage.jsx";
import { useMenuContext } from "../context/MenuContext.jsx";
import { useSelectedChat } from "../context/SelectedChat.jsx";
import { AuthContextProvider } from "../context/AuthContext.jsx";
import { SocketContextProvider } from "../context/SocketContext.jsx";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider.jsx";
import AddFrndToGroup from "./AddFrndToGroup.jsx";

const Chats = () => {
  const screenWidth = useScreen();
  const { user } = useLoggedInUser();
  const { menuBar, groupsPage } = useMenuContext();
  const { openWindow, selectedId, notificationPage, newGroupPage, groupChatPage, selectedGroupId, addFrndToGrp } = useSelectedChat();

  if (!user) {
    return <Navigate to="/" />;
  }

  const renderMobileView = () => (
    <>
      {menuBar ? (
        <>
          <MenuBar />
          {newGroupPage && <NewGroup />}
          {groupsPage && <GroupList />}
        </>
      ) : selectedId == null ? (
        <>
          <UsersList />
          {openWindow && <FindUserPage />}
          {notificationPage && <NotificationPage />}
        </>
      ) : (
        <div className={`${selectedGroupId ? "hidden" : ""} w-full md:w-2/3 h-full bg-[#E8E8F9]`}>
          <ChatSec />
        </div>
      )}
      {selectedGroupId && <div className={`w-full md:w-2/3 h-full bg-[#E8E8F9]`}>{addFrndToGrp && <AddFrndToGroup />}<GroupChat /></div>}
    </>
  );

  const renderDesktopView = () => (
    <>
      {openWindow && <FindUserPage />}
      {notificationPage && <NotificationPage />}
      {newGroupPage && <NewGroup />}
      {addFrndToGrp && <AddFrndToGroup />}
      {menuBar ? (groupsPage ? <GroupList /> : <MenuBar />) : <UsersList />}
      <div className={`hidden md:block w-full md:w-2/3 h-full bg-[#E8E8F9]`}>
        {selectedId ? <ChatSec /> : selectedGroupId ? <GroupChat /> : <InitialPage />}
      </div>
    </>
  );

  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <div className="transition delay-150 ease-linear w-full h-full flex overflow-hidden relative">
          {screenWidth < 768 ? renderMobileView() : renderDesktopView()}
        </div>
      </SocketContextProvider>
    </AuthContextProvider>
  );
};

export default Chats;
