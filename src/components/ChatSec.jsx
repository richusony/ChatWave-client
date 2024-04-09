import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faPaperPlane,
  faPhone,
  faSpinner,
  faVideo,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import useOnline from "../Hooks/useOnline.js";
import SelectedChat from "../context/SelectedChat.jsx";
import { extractTime } from "../utils/helper.js";
import { useSocketContext } from "../context/SocketContext.jsx";
import useRealTimeMsg from "../Hooks/useRealTimeMsg.js";
import "../chat.css";

const ChatSec = () => {
  const { selectedId } = useContext(SelectedChat);
  const isOnline = useOnline();
  const { socket, onlineUsers } = useSocketContext();
  const [userIsTyping, setUserIsTyping] = useState(false); // State to track if the receiver is typing
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState({});
  const [sendLoading, setSendLoading] = useState(false);
  const lastMessage = useRef();

  const handleUserChats = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/messages/${selectedId}`, { credentials: "include" });
    const data = await res.json();
    setMessages(data);
  };

  useRealTimeMsg(messages, setMessages);

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
    if (res.status == 201) setInput("");
    const resData = await res.json();
    setSendLoading(false);
  };

  const handleKeyDown = (e) => {
    console.log("keyisDown")
    if (e.target.value.trim() !== "") {
      socket.emit("userTyping", { receiverId: selectedId, message: "Typing..." });
    }
    if (e.key === "Enter") {
      socket.emit("userStoppedTyping", { receiverId: selectedId });
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputData = (e) => {
    setInput(e.target.value);
  };

  // const handleKeyDownForInput = (e) => {
  //   console.log("keyisDown")
  //   socket.emit("userTyping", { receiverId: selectedId, message: "Typing..." });
  // };

  // const handleKeyUpForInput = (e) => {
  //   console.log("keyisUp")
  //   socket.emit("userStoppedTyping", { receiverId: selectedId });
  // };

  // Listen for userIsTyping and userStoppedTyping events from the server
  useEffect(() => {
    socket.on("userIsTyping", () => {
      setUserIsTyping(true);
    });

    socket.on("userStoppedTyping", () => {
      console.log("isStopped")
      setUserIsTyping(false);
    });

    return () => {
      socket.off("userIsTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket]);



  return (
    <>
      <div className="w-full h-screen relative overflow-hidden bg-[#E8E8F9] dark:bg-[#424769] ">
        {/* Header  */}
        <div className="py-2 px-4 bg-white dark:bg-[#2D3250] shadow-sm md:shadow-none right-0">
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
                  <p> {user.fullname}</p> <p className="text-xs text-gray-400">{onlineUsers.includes(user._id) ? "Online" : "Offline"}</p>
                </span>
              </div>
            </div>

            <div className="w-28 flex justify-between items-center text-lg text-gray-700">
              <span className="cursor-pointer dark:text-[#6c44fa] dark:hover:text-gray-800 hover:text-[#6c44fa]">
                <FontAwesomeIcon icon={faVideo} />
              </span>
              <span className="cursor-pointer dark:text-[#6c44fa] dark:hover:text-gray-800 hover:text-[#6c44fa]">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <span className="cursor-pointer dark:text-[#6c44fa] dark:hover:text-gray-800 hover:text-[#6c44fa]">
                <FontAwesomeIcon icon={faEllipsisV} />
              </span>
            </div>
          </div>
        </div>

        {/* Chats  */}
        <div className="px-3 h-[81vh] overflow-auto scroll-smooth">
          <div className="my-4 text-center">
            <span className="px-2 py-2 bg-white rounded-xl shadow-xl text-gray-700">
              January 10 2023
            </span>
          </div>

          {messages.map((msg) =>
            msg.receiverId == selectedId ? (
              <div key={msg._id} ref={lastMessage} className="my-2 w-full flex justify-end">
                <div className="py-1 px-2 max-w-40 md:w-fit bg-[#FFFFFF]  rounded-xl shadow-md">
                  <p className="text-gray-700">{msg.message}</p>
                  <div className="text-end text-xs">
                    <p className="text-slate-500">{extractTime(msg.createdAt)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div ref={lastMessage} key={msg._id} className="my-2 w-full flex justify-start">
                <div className="py-1 px-2 max-w-40 md:w-fit bg-[#7351F2] rounded-xl shadow-md">
                  <p className="text-white dark:text-gray-800">{msg.message}</p>
                  <div className="text-end text-xs">
                    <p className="text-gray-200 dark:text-gray-700">
                      {extractTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
          <div className={`transition delay-100 ease-linear w-11 h-9 rounded-2xl ${userIsTyping ? "" : "opacity-0"} bg-[#7351F2] text-white flex justify-center items-center`}>
            {userIsTyping && <span className="text-xl font-bold flex justify-center items-center dot-container">
              <span key="dot1" className="dot dot1"></span>
              <span key="dot2" className="dot dot2"></span>
              <span key="dot3" className="dot dot3"></span>
            </span>}
          </div>
        </div>

        {isOnline ? (
          <div className="px-2 py-2 w-full flex items-center justify-between cursor-text">
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
          <div className="px-2 sticky py-2 w-full flex items-center justify-center cursor-text text-center">
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
