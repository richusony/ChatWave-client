import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export const useMenuContext = () => {
    return useContext(MenuContext);
} 

export const MenuContextProvider = ({children}) => {
    const [menuBar,setMenuBar] = useState(false);
    return (
        <MenuContext.Provider value={{menuBar, setMenuBar}}>
            {children}
        </MenuContext.Provider>
    )
}