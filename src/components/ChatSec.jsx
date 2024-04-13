import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faPaperPlane,
  faPhone,
  faSpinner,
  faVideo,
  faWarning,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import useOnline from "../Hooks/useOnline.js";
import { useSelectedChat } from "../context/SelectedChat.jsx";
import { extractTime, getTodayDate, getYesterdayDate } from "../utils/helper.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import useRealTimeMsg from "../Hooks/useRealTimeMsg.js";
import "../chat.css";
import useScreen from "../Hooks/useScreen.js";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider.jsx";

const ChatSec = () => {
  const { selectedId } = useSelectedChat();
  const isOnline = useOnline();
  const screenWidth = useScreen();
  const { socket, onlineUsers } = useSocketContext();
  const [userIsTyping, setUserIsTyping] = useState(false); // State to track if the receiver is typing
  const [menuOptions, setMenuOptions] = useState(false);
  const [messages, setMessages] = useState([]);
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [user, setUser] = useState({});
  const [sendLoading, setSendLoading] = useState(false);
  const lastMessage = useRef();
  const { user: loggedInUser, setUser:setLoggedInUser } = useLoggedInUser()

  const handleUserChats = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/messages/${selectedId}`, { credentials: "include" });
    const data = await res.json();
    // console.log("const messages = ",data);
    const groupedMessages = groupMessagesByDate(data);
    setMessages(groupedMessages);
    setRealTimeMessages(null);
  };

  const todayDate = getTodayDate();
  const yesterdayDate = getYesterdayDate();


  // Function to group messages by date
  function groupMessagesByDate(messages) {
    const groupedMessages = [];

    messages.forEach(message => {
      const date = new Date(message.createdAt);
      const dateString = date.toDateString();

      // Check if the date already exists in groupedMessages
      const existingDateIndex = groupedMessages.findIndex(item => item.dateString === dateString);

      // If the date exists, push the message to its messages array
      if (existingDateIndex !== -1) {
        groupedMessages[existingDateIndex].messages.push(message);
      } else {
        // If the date doesn't exist, create a new entry
        groupedMessages.push({
          dateString: dateString,
          dateObject: date,
          messages: [message],
        });
      }
    });

    return groupedMessages;
  }

  useRealTimeMsg(realTimeMessages, setRealTimeMessages);

  const getUserDetails = async () => {
    const reqData = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/${selectedId}`, { credentials: "include" });
    const resData = await reqData.json();
    setUser(resData);
  };

  useEffect(() => {
    getUserDetails();
    handleUserChats();
  }, [selectedId, sendLoading]);

  useEffect(() => {
    lastMessage.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if(input == "") return;
    setSendLoading(true);
    const reqData = {
      message: input,
    };
    const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/messages/send/${selectedId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reqData),
    });
    const resData = await res.json();
    if (res.status == 201) setInput("");
    setSendLoading(false);
    if (res.status !== 201) {
      setErrorMsg(resData.err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.target.value.trim() !== "") {
      socket?.emit("userTyping", { receiverId: selectedId, message: "Typing..." });
    }
    if (e.key === "Enter") {
      socket?.emit("userStoppedTyping", { receiverId: selectedId });
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputData = (e) => {
    if (e.target.value.trim() == "") {
      socket?.emit("userStoppedTyping", { receiverId: selectedId });
    }
    setInput(e.target.value);
  };

  useEffect(() => {
    socket?.on("userIsTyping", () => {
      setUserIsTyping(true);
    });

    socket?.on("userStoppedTyping", () => {
      setUserIsTyping(false);
    });

    return () => {
      socket?.off("userIsTyping");
      socket?.off("userStoppedTyping");
    };
  }, [socket]);

  const handleBlockUser = async () => {
    const confirm = window.confirm("Are you sure about blocking this user?");
    if (!confirm) return;
    const reqData = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/block/${selectedId}`, { credentials: "include" });
    const resData = await reqData.json();
    sessionStorage.setItem("login-user", JSON.stringify(resData));
    setLoggedInUser(resData);
  }

  const handleUnBlockUser = async () => {
    const confirm = window.confirm("Are you sure about unblocking this user?");
    if (!confirm) return;
    const reqData = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/unblock/${selectedId}`, { credentials: "include" });
    const resData = await reqData.json();
    sessionStorage.setItem("login-user", JSON.stringify(resData));
    setLoggedInUser(resData);
  }

  return (
    <>
      <div className="w-full h-screen relative overflow-hidden bg-[#E8E8F9] dark:bg-[#424769] ">
        {/* Header  */}
        <div key="headerContainer" className="py-2 px-4 bg-white dark:bg-[#2D3250] shadow-sm md:shadow-none right-0">
          <div className="flex justify-between items-center">
            <div className="flex justify-center items-center">
              <div className="w-11">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={user.profileImage}
                  alt="user"
                />
              </div>
              <div className="ml-2">
                <span className="font-semibold dark:text-gray-300">
                  <p> {user.fullname?.length > 15 && screenWidth < 768 ? user.fullname.substring(0, 15) + "..." : user.fullname}</p> {onlineUsers.includes(user._id) ? <p className="text-xs text-gray-400">Online</p> : ""}
                </span>
              </div>
            </div>

            <div className="w-28 flex justify-between items-center text-lg text-gray-700">
              <span className="cursor-not-allowed dark:text-[#6c44fa] dark:hover:text-gray-800 hover:text-[#6c44fa]">
                <FontAwesomeIcon icon={faVideo} />
              </span>
              <span className="cursor-not-allowed dark:text-[#6c44fa] dark:hover:text-gray-800 hover:text-[#6c44fa]">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <span className={`relative cursor-pointer dark:text-[#6c44fa] dark:hover:text-gray-800 ${!menuOptions && "hover:text-[#6c44fa]"}`} >
                <FontAwesomeIcon icon={faEllipsisV} onClick={() => setMenuOptions((prev) => !prev)} />
                {menuOptions && <span className="border dark:border-[#2D3250] px-2 py-2 w-52 dark:text-white hover:text-gray-800 dark:hover:text-white absolute bg-[#F1F1F1] dark:bg-[#2D3250] right-full top-full rounded shadow-xl">
                  {loggedInUser.friends.some((frnd) => frnd.friendId == user._id && frnd.blockByUser == true) ? <p key="headerBtn1" onClick={handleUnBlockUser} className="mb-1 py-1 dark:hover:text-[#6c44fa]">Unblock</p> :
                    <p key="headerBtn1" onClick={handleBlockUser} className="mb-1 py-1 dark:hover:text-[#6c44fa]">Block</p>}
                  <p key="headerBtn2" className="mb-1 py-1 dark:hover:text-[#6c44fa]"><s>Theme</s></p>
                  <p key="headerBtn3" className="mb-1 py-1 dark:hover:text-[#6c44fa]"><s>Clear All</s></p>
                  <p key="headerBtn4" className="mb-1 py-1 dark:hover:text-[#6c44fa]"><s>Unfollow</s></p>
                </span>}
              </span>
            </div>
          </div>
        </div>

        {/* Chats  */}
        <div key="messagesContainer" className="px-3 h-[81vh] overflow-auto scroll-smooth">
          {messages.length > 0 && messages.map((msg,index) => (
            <div key={"messagesContainer"+index}>
              <div key={"date" + msg._id} className="my-10 text-center">
                <span className="px-3 py-2 bg-white rounded-md shadow-xl text-gray-700">
                  {msg.dateString == todayDate.replaceAll(",", "") ? "Today" : msg.dateString == yesterdayDate.replaceAll(",", "") ? "Yesterday" : msg.dateString}
                </span>
              </div>

              {msg.messages.length > 0 && msg.messages.map((msgs) =>
                msgs.receiverId == selectedId ? (
                  <div key={msgs._id} ref={lastMessage} className="my-2 w-full flex justify-end">
                    <div className="py-1 px-2 max-w-[80%] md:w-fit bg-[#FFFFFF]  rounded-xl shadow-md">
                      <p className="text-gray-700 break-words">{msgs.message}</p>
                      <div className="text-end text-xs">
                        <p className="text-slate-500">{extractTime(msgs.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div ref={lastMessage} key={msgs._id} className="my-2 w-full flex justify-start">
                    <div className="py-1 px-2 max-w-[80%] md:w-fit bg-[#7351F2] rounded-xl shadow-md">
                      <p className="text-white dark:text-gray-800 break-words">{msgs.message}</p>
                      <div className="text-end text-xs">
                        <p className="text-gray-200 dark:text-gray-700">
                          {extractTime(msgs.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
          {realTimeMessages && realTimeMessages.map((msgs) => msgs.receiverId == selectedId ? (
            <div key={msgs._id} ref={lastMessage} className="my-2 w-full flex justify-end">
              <div className="py-1 px-2 max-w-40 md:w-fit bg-[#FFFFFF]  rounded-xl shadow-md">
                <p className="text-gray-700">{msgs.message}</p>
                <div className="text-end text-xs">
                  <p className="text-slate-500">{extractTime(msgs.createdAt)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div ref={lastMessage} key={msgs._id} className="my-2 w-full flex justify-start">
              <div className="py-1 px-2 max-w-40 md:w-fit bg-[#7351F2] rounded-xl shadow-md">
                <p className="text-white dark:text-gray-800">{msgs.message}</p>
                <div className="text-end text-xs">
                  <p className="text-gray-200 dark:text-gray-700">
                    {extractTime(msgs.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className={`transition delay-100 ease-linear w-11 h-9 rounded-2xl ${userIsTyping ? "" : "opacity-0"} bg-[#7351F2] text-white flex justify-center items-center`}>
            {userIsTyping && <span className="text-xl font-bold flex justify-center items-center dot-container">
              <span key="dot1" className="dot dot1"></span>
              <span key="dot2" className="dot dot2"></span>
              <span key="dot3" className="dot dot3"></span>
            </span>}
          </div>
        </div>

        {isOnline ? (
          <div key="inputContainer" className="relative px-2 py-2 w-full flex items-center justify-between cursor-text">
            <div className={`transition delay-150 ease-linear absolute -top-10 ${errorMsg ? "translate-x-0" : "-translate-x-full opacity-0"} bg-[#7351F2] text-center px-4 py-2 rounded text-white dark:text-gray-800 shadow-md`}><FontAwesomeIcon icon={faWarning} /> <span>{errorMsg}</span></div>
            <input
              className="outline-none bg-white dark:bg-[#2D3250] dark:text-gray-300 w-screen py-3 px-3 rounded-full"
              type="text"
              value={input}
              placeholder="type something..."
              onChange={handleInputData}
              onKeyDown={handleKeyDown}
            // onKeyUp={handleKeyUpForInput}
            />
            <span
              onClick={handleSendMessage}
              className="ml-2 py-3 px-4 text-white dark:text-gray-800 bg-[#7351F2] cursor-pointer rounded-full"
            >
              {sendLoading ? <FontAwesomeIcon icon={faSpinner} /> : <FontAwesomeIcon icon={faPaperPlane} />}
            </span>
          </div>
        ) : (
          <div key="offlineContainer" className="px-2 sticky py-2 w-full flex items-center justify-center cursor-text text-center">
            <h1 className="text-center text-gray-500 cursor-wait text-xl font-semibold">
              You're Offline{" "}
              <FontAwesomeIcon className="hover:text-[#6c44fa]" icon={faWifi} />
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatSec;