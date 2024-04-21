import "../chat.css";
import { useEffect, useRef, useState } from "react";
import {
  faEllipsisV,
  faPaperPlane,
  faPhone,
  faSpinner,
  faVideo,
  faWarning,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";
import useScreen from "../Hooks/useScreen.js";
import useOnline from "../Hooks/useOnline.js";
import useRealTimeMsg from "../Hooks/useRealTimeMsg.js";
import { useSelectedChat } from "../context/SelectedChat.jsx";
import { useSocketContext } from "../context/SocketContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider.jsx";
import { extractTime, getTodayDate, getYesterdayDate } from "../utils/helper.js";

const GroupChat = () => {
  const membersMap = [];
  const isOnline = useOnline();
  const lastMessage = useRef();
  const screenWidth = useScreen();
  const [user, setUser] = useState({});
  const [input, setInput] = useState("");
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const { selectedGroupId } = useSelectedChat();
  const [errorMsg, setErrorMsg] = useState(null);
  const [groupData, setGroupData] = useState(null);
  const { socket, onlineUsers } = useSocketContext();
  const [sendLoading, setSendLoading] = useState(false);
  const [menuOptions, setMenuOptions] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const { user: loggedInUser, setUser: setLoggedInUser } = useLoggedInUser();

  const handleGroupChats = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/messages/group/${selectedGroupId}`, { credentials: "include" });
    const data = await res.json();
    console.log("const messages = ", data);
    setGroupData(data);
    const groupedMessages = groupMessagesByDate(data.messages);
    setMessages(groupedMessages);
    setRealTimeMessages(null);
    data?.participants?.forEach((mem) => { membersMap[mem._id] = mem.fullname });
    setMembers(membersMap)
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

  // const getGroupDetails = async () => {
  //   const reqData = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/messages/group/${selectedGroupId}`, { credentials: "include" });
  //   const resData = await reqData.json();
  //   setUser(resData);

  // };

  useEffect(() => {
    // getGroupDetails();
    handleGroupChats();
  }, [selectedGroupId, sendLoading]);

  useEffect(() => {
    lastMessage.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input == "") return;
    setSendLoading(true);
    const reqData = {
      message: input,
    };
    const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/messages/group/send/${selectedGroupId}`, {
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
      socket?.emit("userTyping", { receiverId: selectedGroupId, message: "Typing..." });
    }
    if (e.key === "Enter") {
      socket?.emit("userStoppedTyping", { receiverId: selectedGroupId });
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputData = (e) => {
    if (e.target.value.trim() == "") {
      socket?.emit("userStoppedTyping", { receiverId: selectedGroupId });
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
    const reqData = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/block/${selectedGroupId}`, { credentials: "include" });
    const resData = await reqData.json();
    sessionStorage.setItem("login-user", JSON.stringify(resData));
    setLoggedInUser(resData);
  }

  const handleUnBlockUser = async () => {
    const confirm = window.confirm("Are you sure about unblocking this user?");
    if (!confirm) return;
    const reqData = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/users/unblock/${selectedGroupId}`, { credentials: "include" });
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
                  src={groupData?.groupImg}
                  alt="groupImage"
                />
              </div>
              <div className="ml-2">
                <span className="font-semibold dark:text-gray-300">
                  <p> {groupData?.groupName?.length > 15 && screenWidth < 768 ? groupData?.groupName.substring(0, 15) + "..." : groupData?.groupName}</p> {onlineUsers.includes(groupData?._id) ? <p className="text-xs text-gray-400">Online</p> : ""}
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
          {messages.length > 0 && messages.map((msg, index) => (
            <div key={"messagesContainer" + index}>
              <div key={"date" + msg._id} className="my-10 text-center">
                <span className="px-3 py-2 bg-white rounded-md shadow-xl text-gray-700">
                  {msg.dateString == todayDate.replaceAll(",", "") ? "Today" : msg.dateString == yesterdayDate.replaceAll(",", "") ? "Yesterday" : msg.dateString}
                </span>
              </div>

              {msg.messages.length > 0 && msg.messages.map((msgs) =>
                msgs.senderId == loggedInUser._id ? (
                  <div key={msgs._id} ref={lastMessage} className="my-2 w-full flex justify-end">
                    <div className="py-1 px-2 min-w-[35%] md:min-w-[15%] max-w-[80%] md:w-fit bg-[#FFFFFF]  rounded-xl shadow-md">
                      <p className="text-xs text-[#7351F2] font-bold">You</p>
                      <p className="text-gray-700 break-words">{msgs.message}</p>
                      <div className="text-end text-xs">
                        <p className="text-slate-500">{extractTime(msgs.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div ref={lastMessage} key={msgs._id} className="my-2 w-full flex justify-start">
                    <div className="py-1 px-2 min-w-[35%] md:min-w-[15%] max-w-[80%] md:w-fit bg-[#7351F2] rounded-xl shadow-md">
                      <p className="text-xs text-white font-bold dark:text-gray-800">{members[msgs.senderId]}</p>
                      <p className="text-slate-100 dark:text-gray-800 break-words">{msgs.message}</p>
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
          {realTimeMessages && realTimeMessages.map((msgs) => msgs.senderId == loggedInUser._id ? (
            <div key={msgs._id} ref={lastMessage} className="my-2 w-full flex justify-end">
              <div className="py-1 px-2 min-w-[35%] md:min-w-[15%] max-w-52 md:w-fit bg-[#FFFFFF]  rounded-xl shadow-md">
                <p className="text-xs text-white font-bold dark:text-gray-800">You</p>
                <p className="text-gray-700">{msgs.message}</p>
                <div className="text-end text-xs">
                  <p className="text-slate-500">{extractTime(msgs.createdAt)}</p>
                </div>
              </div>
            </div>
          ) : (
            <div ref={lastMessage} key={msgs._id} className="my-2 w-full flex justify-start">
              <div className="py-1 px-2 min-w-[35%] md:min-w-[15%] max-w-52 md:w-fit bg-[#7351F2] rounded-xl shadow-md">
                <p className="text-xs text-white font-bold dark:text-gray-800">Richu Sony</p>
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

export default GroupChat;