import Message from "../message/Message";
import "./ChatBox.css";
import { useEffect, useRef, useState } from "react";
const ChatBox = ({ socket, conversation }) => {
  const [messages, setMessages] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    console.log("messages outside", messages);
    const handleReceiveMessage = (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, messages]);
  // Use useEffect to scroll to the bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box" ref={chatBoxRef}>
      {messages &&
        messages.map((message, index) => {
          return <Message key={index} message={message} />;
        })}
    </div>
  );
};
export default ChatBox;
