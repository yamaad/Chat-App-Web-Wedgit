import { useEffect, useState } from "react";
import "./ChatWindow.css";
import CustomerForm from "../customerForm/CustomerForm";
import ChatBox from "../chatBox/ChatBox";
import ChatBar from "../chatBar/ChatBar";
import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_API_URL);
const ChatWindow = ({ isOpen }) => {
  const [user, setUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  useEffect(() => {
    if (conversation) {
      socket.emit("join_conversation", conversation);
    }
  }, [conversation]);
  return (
    <div className={`chat-window ${isOpen ? "" : "close"}`}>
      {user ? (
        <div className="chat-window-chat">
          {conversation && socket && (
            <>
              <ChatBox socket={socket} conversation={conversation} />
              <ChatBar socket={socket} conversation={conversation} />
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
