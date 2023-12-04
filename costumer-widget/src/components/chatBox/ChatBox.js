import Message from "../message/Message";
import "./ChatBox.css";
import { useEffect, useRef, useState } from "react";
const ChatBox = ({ socket, conversation }) => {
  const [messages, setMessages] = useState([]);
  const [timer, setTimer] = useState(null);
  const chatBoxRef = useRef(null);
  useEffect(() => {
    fetchChatHistory();
  }, []);
  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage);
    socket.on("remaining_time", (time) => {
      setTimer(time);
    });
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("remaining_time", (time) => {
        setTimer(time);
      });
    };
  }, []); 
  // Use useEffect to scroll to the bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);
  const handleReceiveMessage = (messageData) => {
    socket.emit("reset_timer", messageData.conversation_id);
    setMessages((prevMessages) => [...prevMessages, messageData]);
  };
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/messages/${conversation._id}`
      );
      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      }
    } catch (error) {}
  };
  return (
    <div className="chat-box" ref={chatBoxRef}>
      <div className="chat-box-timer">
        {timer && timer < 61 && timer > 0 && (
          <>
            <p>inactive session will end in: </p>
            <p>
              <strong>{timer}</strong>
            </p>
          </>
        )}
      </div>
      {messages &&
        messages.map((message, index) => {
          return <Message key={message._id} message={message} />;
        })}
    </div>
  );
};
export default ChatBox;
