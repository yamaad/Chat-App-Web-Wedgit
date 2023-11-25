import { useState } from "react";
import "./ChatBar.css";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messagesSlice";
import { IoSendSharp } from "react-icons/io5";

const ChatBar = () => {
  const [messageInput, setMessageInput] = useState("");
  const conversation = useSelector((state) => state.conversation).conversation;
  const messages = useSelector((state) => state.messages).messages;
  const dispatch = useDispatch();
  const handleSend = async () => {
    if (messageInput && conversation) {
      const request = {
        conversation_id: conversation._id,
        user_id: conversation.user_id,
        content: messageInput,
        is_agent_message: true,
      };
      try {
        const sendMessageResponse = await fetch("/api/messages", {
          method: "POST",
          body: JSON.stringify(request),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await sendMessageResponse.json();
        if (sendMessageResponse.ok) {
          dispatch(setMessages([...messages, json]));
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
        disabled={conversation ? false : true}
        className="chat-bar-input"
        name="text"
        value={messageInput}
        onChange={(event) => {
          setMessageInput(event.target.value);
        }}
      />
      <button
        disabled={conversation ? false : true}
        className="chat-bar-button"
        onClick={handleSend}
      >
        <IoSendSharp />
      </button>
    </div>
  );
};

export default ChatBar;
