import { createContext, useContext, useState } from "react";

const SelectedChat = createContext([]);

export const useSelectedChat = () => {
    return useContext(SelectedChat);
}

export const SelectedChatProvider = ({ children }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [openWindow, setOpenWindow] = useState(false);
    const [addFrndToGrp, setAddFrndToGrp]= useState(false);
    const [newGroupPage, setNewGroupPage] = useState(false);   
    const [groupChatPage, setGroupChatPage] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [notificationPage, setNotificationPage] = useState(false);
    return (
        <SelectedChat.Provider value={{ openWindow, setOpenWindow, notificationPage, setNotificationPage, selectedId, setSelectedId, setNewGroupPage, newGroupPage, selectedGroupId, setSelectedGroupId, groupChatPage, setGroupChatPage, addFrndToGrp, setAddFrndToGrp }}>
            {children}
        </SelectedChat.Provider>
    )
}

