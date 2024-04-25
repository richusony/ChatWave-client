import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  faAngleRight,
  faBars,
  faBell,
  faMoon,
  faSearch,
  faSun,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import useScreen from "../Hooks/useScreen.js";
import { ThemeProvdier } from "../context/theme";
import { getAllMessages } from "../utils/helper.js"
import { useMenuContext } from "../context/MenuContext.jsx";
import { useSelectedChat } from "../context/SelectedChat.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UsersList = () => {
  const screenWidth = useScreen();
  const { menuBar, setMenuBar } = useMenuContext()
  const [userData, setUserData] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme"));
  const { selectedId, setSelectedId, selectedGroupId, setOpenWindow, notificationPage, setNotificationPage } = useSelectedChat();

  useEffect(() => {
    getAllMessages(setUserData, setFilteredUser);
  }, []);

  useEffect(() => {
    handleSearchUsers();
  }, [searchUser]);

  useEffect(() => {
    document.querySelector("html").classList.remove("light", "dark");
    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  const handleSearchUsers = useCallback(() => {
    const searchTerm = searchUser.trim().toLowerCase(); // Trim and convert search input to lowercase
    if (searchTerm !== "") {
      const newData = userData.filter((user) =>
        user.senderInfo.fullname.toLowerCase().includes(searchTerm)
      );
      setFilteredUser(newData);
    } else {
      setFilteredUser(userData); // Reset to original data when search input is empty
    }
  }, [searchUser]);

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
      <div className={`${screenWidth < 768 ? (selectedGroupId ? "hidden" : "") : (menuBar && selectedGroupId ? "hidden" : "")} w-full md:w-1/3 h-screen bg-[#FFFFFF] dark:bg-[#424769]  py-2 px-2 overflow-hidden`}>
        <div className="mb-2 px-2 py-2">
          <div className="px-2 flex justify-between">
            <h2 className="text-xl">
              <FontAwesomeIcon onClick={() => setMenuBar(true)}
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
                <FontAwesomeIcon onClick={() => { setNotificationPage((prev) => !prev), setOpenWindow(false) }}
                  className={`transition delay-75 ease-linear ${notificationPage ? 'text-[#6c44fa]' : 'text-gray-600'} hover:text-[#6c44fa] dark:text-gray-800 dark:hover:text-[#6c44fa] cursor-pointer`}
                  icon={faBell}
                />

              </h2>
              <h2 className="text-xl">
                <FontAwesomeIcon onClick={() => { setOpenWindow(true), setNotificationPage(false) }}
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
          {filteredUser.map((user) => (
            <Link
              onClick={() => setSelectedId(user.senderId)}
              key={user.senderId}
              to="/chats"
              className="group"
            >
              <div className="my-1 border-gray-500 bg-[#FBFBFB] dark:bg-[#7077A1] px-2 py-2 flex justify-between items-center rounded">
                <div className="flex items-center justify-center">
                  <div className="mr-2 w-14">
                    <img
                      className="w-full h-full rounded-full object-cover"
                      src={user.senderInfo.profileImage}
                      alt="user"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold  dark:text-gray-900">
                      {user.senderInfo.fullname.length > 15 && screenWidth < 768 ? user.senderInfo.fullname.substring(0, 15) + "..." : user.senderInfo.fullname}
                    </h3>
                    <span className="text-gray-800 text-sm">
                      {user.message.length > 35 ? user.message.substring(0, 15) + "..." : user.message}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`${selectedId == user.senderId ? "text-[#6c44fa]" : "text-gray-500"} dark:text-gray-800 text-xl group-hover:text-[#6c44fa]`}>
                    <FontAwesomeIcon icon={faAngleRight} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {filteredUser.length < 1 && <div className="mt-8 text-center"><span className="text-gray-500 text-xl">Find new friends!!</span></div>}
        </div>
      </div>
    </ThemeProvdier>
  );
};

export default UsersList;
