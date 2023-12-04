import { useEffect, useState } from "react";
import "./ChatWindow.css";
import CustomerForm from "../customerForm/CustomerForm";
import ChatBox from "../chatBox/ChatBox";
import ChatBar from "../chatBar/ChatBar";
import io from "socket.io-client";

const ChatWindow = ({ isOpen }) => {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [conversation, setConversation] = useState(
    JSON.parse(sessionStorage.getItem("conversation"))
  );

  useEffect(() => {
    if (!socket) {
      setSocket(socket ?? io.connect(process.env.REACT_APP_API_URL));
    }
    if (conversation && socket) {
      socket.emit("join_conversation", conversation);
      socket.on("end_conversation", handleSessionEnd);
    }
    if (socket)
      return () => {
        socket.off("end_conversation", handleSessionEnd);
      };
  }, [conversation, socket]); 

  const handleSessionEnd = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("conversation");
    setUser(null);
    setConversation(null);
  };
  return (
    <div className={`chat-window ${isOpen ? "" : "close"}`}>
      {user ? (
        <div className="chat-window-chat">
          {conversation && socket && (
            <>
              <ChatBox socket={socket} conversation={conversation} />
              <ChatBar conversation={conversation} />
            </>
          )}
        </div>
      ) : (
        <div className="chat-window-form">
          <CustomerForm setUser={setUser} setConversation={setConversation} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
