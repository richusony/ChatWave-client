import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  faBars,
  faBell,
  faClose,
  faMoon,
  faSearch,
  faSun,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import useScreen from "../Hooks/useScreen";
import { ThemeProvdier } from "../context/theme";
import SelectedChat from "../context/SelectedChat.jsx";
import NotificationPage from "./NotificationPage.jsx";
import { useMenuContext } from "../context/MenuContext.jsx";

const UsersList = () => {
  const screenWidth = useScreen();
  const { setSelectedId, setOpenWindow, notificationPage, setNotificationPage} = useContext(SelectedChat);
  const {setMenuBar} = useMenuContext()
  const [userData, setUserData] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme"));

  useEffect(() => {
    try {
      async function getUsers() {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/`,{withCredentials:true});
      const data = res.data;
      setUserData(data);
      setFilteredUser(data);
    }
    getUsers();
    // console.log(userData);
    } catch (error) {
      console.log("error while fetching users ",error)
    }
  }, []);

  useEffect(() => {
    handleSearchUsers();
  }, [searchUser]);

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  const handleSearchUsers = () => {
    const searchTerm = searchUser.trim().toLowerCase(); // Trim and convert search input to lowercase
    if (searchTerm !== "") {
      const newData = userData.filter((user) =>
        user.fullname.toLowerCase().includes(searchTerm)
      );
      setFilteredUser(newData);
    } else {
      setFilteredUser(userData); // Reset to original data when search input is empty
    }
  };

  const darkTheme = () => {
    setThemeMode("dark");
    localStorage.setItem("theme", "dark");
  };
  const lightTheme = () => {
    setThemeMode("light");
    localStorage.setItem("theme", "light");
  };

  const handleTheme = () => {
    if (themeMode === "dark") {
      lightTheme();
    } else {
      darkTheme();
    }
  };

  return (
    <ThemeProvdier value={{ themeMode, darkTheme, lightTheme }}>
      <div className="w-full md:w-1/3 h-screen bg-[#FFFFFF] dark:bg-[#424769]  py-2 px-2 overflow-hidden">
        <div className="mb-2 px-2 py-2">
          <div className="px-2 flex justify-between">
            <h2 className="text-xl">
              <FontAwesomeIcon onClick={()=> setMenuBar(true)}
                icon={faBars}
                className="hover:text-[#6c44fa] dark:text-gray-800 dark:hover:text-[#6c44fa] cursor-pointer"
              />
            </h2>
            <div className="flex justify-between">
              <h2 className="mr-7 text-xl">
                <FontAwesomeIcon
                  onClick={handleTheme}
                  className="transition delay-150 ease-linear text-gray-600 hover:text-[#6c44fa] dark:text-gray-800 dark:hover:text-[#6c44fa] cursor-pointer"
                  icon={themeMode === "dark" ? faSun : faMoon}
                />
              </h2>
              <h2 className="mr-7 text-xl">
                <FontAwesomeIcon onClick={()=>{setNotificationPage((prev)=> !prev), setOpenWindow(false)}}
                  className={`transition delay-75 ease-linear ${notificationPage?'text-[#6c44fa]':'text-gray-600'} hover:text-[#6c44fa] dark:text-gray-800 dark:hover:text-[#6c44fa] cursor-pointer`}
                  icon={faBell}
                />
                {notificationPage && <NotificationPage/> }
              </h2>
              <h2 className="text-xl">
               <FontAwesomeIcon onClick={()=>{setOpenWindow(true), setNotificationPage(false)}}
                  className="text-gray-600 hover:text-[#6c44fa] dark:text-gray-800 dark:hover:text-[#6c44fa] cursor-pointer"
                  icon={faUserPlus}
                />
              </h2>
            </div>
          </div>
        </div>

        <div className="my-1">
          <div className="mx-2 px-2 py-1 border-2 border-gray-500 hover:border-[#8463f9] rounded-full text-xl flex justify-evenly md:justify-between items-center cursor-text shadow-sm">
            <input
              className="px-2 py-1 outline-none w-full bg-transparent dark:text-gray-300"
              placeholder="Search"
              type="text"
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <FontAwesomeIcon
              onClick={handleSearchUsers}
              className="transition delay-150 ease-linear text-gray-500 cursor-pointer hover:text-[#6c44fa]"
              icon={faSearch}
            />
          </div>
        </div>

        <div className="h-5/6 overflow-auto">
          {filteredUser.map((user, index, array) => (
            <Link
              onClick={() => setSelectedId(user._id)}
              key={user._id}
              to={
                screenWidth < 767
                  ? `/mobile/chats/${user.username}`
                  : `/chats/${user.username}`
              }
            >
              <div className="my-1 border-gray-500 bg-[#FBFBFB] dark:bg-[#7077A1] px-2 py-2 flex justify-between items-center rounded">
                <div className="flex items-center justify-center">
                  <div className="mr-2 w-14">
                    <img
                      className="w-full h-full rounded-full object-cover"
                      src={user.profileImage}
                      alt="user"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold  dark:text-gray-900">
                      {user.fullname}
                    </h3>
                    <span className="text-gray-800 text-sm">
                      {/* {user.messages[user.messages.length - 1].message.length >
                      30
                        ? user.messages[
                            user.messages.length - 1
                          ].message.substring(0, 25) + "..."
                        : user.messages[user.messages.length - 1].message} */}
                      @{user.username}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-800 text-sm">
                    {/* {user.messages[user.messages.length - 1].time} */}2:30pm
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ThemeProvdier>
  );
};

export default UsersList;
