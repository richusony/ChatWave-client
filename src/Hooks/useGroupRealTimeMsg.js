import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import { useLoggedInUser } from "../context/LoggedInUserCnxtProvider";
import notificationSound from "../assets/sounds/ElevenLabs_2024-04-10T04_49_24_Matilda.mp3";

const useGroupRealTime = (messages, setMessages) => {
  const { socket } = useSocketContext();
 const { user: loggedInUser, setUser: setLoggedInUser } = useLoggedInUser();

  useEffect(() => {

    socket?.on("newMessageInGroup", (newMessage) => {
      if (newMessage.senderId == loggedInUser._id) return
      const sound = new Audio(notificationSound);
      sound.play();
      // messages[messages.length - 1].messages.push(newMessage);
      setMessages([newMessage]);
    });

    return () => { socket?.off("newMessageInGroup")}
  }, [socket, messages, setMessages]);
};

export default useGroupRealTime;
