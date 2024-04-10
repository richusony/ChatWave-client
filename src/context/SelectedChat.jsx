import { createContext, useContext, useState } from "react";

const SelectedChat = createContext([]);

export const useSelectedChat = () => {
    return useContext(SelectedChat);
}

export const SelectedChatProvider = ({ children }) => {
    const [selectedId, setSelectedId] = useState(null);
    console.log("selected Id ;; ", selectedId);
    const [openWindow, setOpenWindow] = useState(false);
    const [notificationPage, setNotificationPage] = useState(false)
    return (
        <SelectedChat.Provider value={{ openWindow, setOpenWindow, notificationPage, setNotificationPage, selectedId, setSelectedId }}>
            {children}
        </SelectedChat.Provider>
    )
}

