import { useEffect, useState } from "react";
import "./ChatBar.css";
import { useSelector } from "react-redux";
import { IoSendSharp } from "react-icons/io5";

const ChatBar = ({ socket }) => {
  const [messageInput, setMessageInput] = useState("");
  const conversation = useSelector((state) => state.conversation).conversation;
  useEffect(() => {
    console.log(conversation);
    setMessageInput("");
  }, [conversation]);
  const handleSend = async () => {
    if (messageInput && conversation ? conversation.is_active : conversation) {
      const request = {
        conversation_id: conversation._id,
        user_id: conversation.user_id,
        content: messageInput,
        is_agent_message: true,
      };
      try {
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
        const json = await sendMessageResponse.json();
        if (sendMessageResponse.ok) {
          await socket.emit("send_message", json);
        }
        setMessageInput("");
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
