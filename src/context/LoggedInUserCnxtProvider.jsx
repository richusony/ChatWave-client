import React, { useContext, useState } from "react";
import LoggedInUserContext from "./LoggedInUserContexs.js";

export const useLoggedInUser = () => {
    return useContext(LoggedInUserContext);
}

const LoggedInUserCnxtProvider = ({children}) => {

    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("login-user")) || null);
    
    return (
        <LoggedInUserContext.Provider value={{user,setUser}}>
            {children}
        </LoggedInUserContext.Provider>
    )
}

export default LoggedInUserCnxtProvider;