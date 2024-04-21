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
import { getAllGroups } from "../utils/helper.js";
import { useMenuContext } from "../context/MenuContext.jsx";
import { useSelectedChat } from "../context/SelectedChat.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GroupList = () => {
  const screenWidth = useScreen();
  const { setMenuBar, setGroupsPage } = useMenuContext()
  const [groupData, setGroupData] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme"));
  const { setSelectedId, selectedGroupId, setSelectedGroupId, setOpenWindow, notificationPage, setNotificationPage } = useSelectedChat();

  useEffect(() => {
    getAllGroups(setGroupData, setFilteredGroups);
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
      const newData = groupData.filter((user) =>
        user.senderInfo.fullname.toLowerCase().includes(searchTerm)
      );
      setFilteredGroups(newData);
    } else {
      setFilteredGroups(groupData); // Reset to original data when search input is empty
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
      <div className={`${selectedGroupId?"hidden":""} w-full md:w-1/3 h-screen bg-[#FFFFFF] dark:bg-[#424769]  py-2 px-2 overflow-hidden`}>
        <div className="mb-2 px-2 py-2">
          <div className="px-2 flex justify-between">
            <h2 className="text-xl">
              <FontAwesomeIcon onClick={() => {setMenuBar(true); setGroupsPage(false)}}
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
          {filteredGroups.map((group) => (
            <Link
              onClick={() => {setSelectedGroupId(group._id); setSelectedId(null)}}
              key={group._id}
              to="/chats"
              className="group"
            >
              <div className="my-1 border-gray-500 bg-[#FBFBFB] dark:bg-[#7077A1] px-2 py-2 flex justify-between items-center rounded">
                <div className="flex items-center justify-center">
                  <div className="mr-3 w-14">
                    <img
                      className="w-full h-full rounded-full object-cover"
                      src={group.groupImg}
                      alt="group"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg  dark:text-gray-900">
                      {group.groupName.length > 15 && screenWidth < 768 ? group.groupName.substring(0, 15) + "..." : group.groupName}
                    </h3>
                    {/* <span className="text-gray-800 text-sm">
                      {group.message.length > 35 ? group.message.substring(0, 15) + "..." : group.message}
                        hello
                    </span> */}
                  </div>
                </div>

                <div>
                  <span className={`${selectedGroupId == group._id ? "text-[#6c44fa]" : "text-gray-500"} dark:text-gray-800 text-xl group-hover:text-[#6c44fa]`}>
                    <FontAwesomeIcon icon={faAngleRight} />
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

export default GroupList;