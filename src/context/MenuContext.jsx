import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export const useMenuContext = () => {
    return useContext(MenuContext);
} 

export const MenuContextProvider = ({children}) => {
    const [menuBar,setMenuBar] = useState(false);
    const [groupsPage,setGroupsPage] = useState(false);
    return (
        <MenuContext.Provider value={{menuBar, setMenuBar, groupsPage, setGroupsPage}}>
            {children}
        </MenuContext.Provider>
    )
}