import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import notificationSound from "../assets/sounds/ElevenLabs_2024-04-10T04_49_24_Matilda.mp3"

const useRealTimeMsg = (messages, setMessages) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notificationSound);
      sound.play();
      // messages[messages.length - 1].messages.push(newMessage);
      setMessages([newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, messages, setMessages]);
};

export default useRealTimeMsg;
