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
      customer-widget
      <ChatBubble onClick={toggleChat} isChatOpen={isChatOpen} />
      <ChatWindow isOpen={isChatOpen} />
    </div>
  );
};
