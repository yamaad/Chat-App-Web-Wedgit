import { useEffect, useState } from "react";
import "./ChatBar.css";
import { useSelector } from "react-redux";
import { IoSendSharp } from "react-icons/io5";

const ChatBar = ({ socket }) => {
  const [messageInput, setMessageInput] = useState("");
  const conversation = useSelector((state) => state.conversation).conversation;
  // empty the input bar if user switch conversation
  useEffect(() => {
    setMessageInput("");
  }, [conversation]);

  //handle sending messages
  const handleSend = async () => {
    if (messageInput && conversation ? conversation.is_active : conversation) {
      const request = {
        conversation_id: conversation._id,
        user_id: conversation.user_id,
        content: messageInput,
        is_customer_message: false,
      };
      try {
        setMessageInput("");
        const sendMessageResponse = await fetch(
          process.env.REACT_APP_API_URL + "/api/messages",
          {
            method: "POST",
            body: JSON.stringify(request),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  return (
    <div className="chat-bar">
      <textarea
        disabled={conversation ? !conversation.is_active : true}
        className="chat-bar-input"
        name="text"
        value={messageInput}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) handleSend();
        }}
        onChange={(event) => {
          setMessageInput(event.target.value);
        }}
      />
      <button
        disabled={conversation ? !conversation.is_active : true}
        className="chat-bar-button"
        onClick={handleSend}
      >
        <IoSendSharp />
      </button>
    </div>
  );
};

export default ChatBar;
