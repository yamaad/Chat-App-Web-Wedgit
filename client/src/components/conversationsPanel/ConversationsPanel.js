import Conversation from "../conversation/Conversation";
import "./ConversationsPanel.css";

const ConversationPanel = ({ conversations, socket }) => {
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
