import React, { useState } from "react";
import ChatBubble from "./components/ChatBubble/ChatBubble";
import ChatWindow from "./components/ChatWindow/chatWindow";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="App">
      <ChatBubble onClick={toggleChat} />
      <ChatWindow isOpen={isChatOpen} onClose={toggleChat} />
    </div>
  );
}

export default App;
