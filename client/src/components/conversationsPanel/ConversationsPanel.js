import Conversation from "../conversation/Conversation";
import { useEffect } from "react";
import "./ConversationsPanel.css";

const ConversationPanel = ({ conversations, socket, setConversations }) => {
  useEffect(() => {
    //listen to existing conversation
    if (conversations) {
      conversations.map((conversation) => {
        if (conversation.is_active) {
          socket.emit("init_conversation", conversation);
        }
      });
    }
  }, []);
  useEffect(() => {
    //listen for new conversation
    const handleNewConversation = (conversation) => {
      socket.emit("init_conversation", conversation);
      setConversations((prevConversations) => [
        conversation,
        ...prevConversations,
      ]);
    };
    socket.on("new_conversation", handleNewConversation);
    return () => {
      socket.off("new_conversation", handleNewConversation);
    };
  }, [conversations, socket]);

  return (
    <div className="conversation-panel">
      {conversations &&
        conversations.map((conversation, index) => {
          return (
            <Conversation
              key={index}
              conversation={conversation}
              socket={socket}
            />
          );
        })}
    </div>
  );
};

export default ConversationPanel;
