import React, { useState } from "react";
import "./CustomerWidget.css";
import ChatBubble from "../components/ChatBubble/ChatBubble";
import ChatWindow from "../components/ChatWindow/chatWindow";

export const CustomerWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="customer-widget">
      <h1>
        <span>GO &rarr; </span>
        <a href="https://chat-app-client-deploy.web.app/" target="_blank">
          agent chat interface
        </a>
      </h1>
      <ChatBubble onClick={toggleChat} isChatOpen={isChatOpen} />
      <ChatWindow isOpen={isChatOpen} />
    </div>
  );
};
