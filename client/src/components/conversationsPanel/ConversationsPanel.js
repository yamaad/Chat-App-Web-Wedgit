import Conversation from "../conversation/Conversation";
import "./ConversationsPanel.css";

const ConversationPanel = ({ conversations }) => {
  return (
    <div className="conversation-panel">
      {conversations &&
        conversations.map((conversation, index) => {
          return <Conversation key={index} conversation={conversation} />;
        })}
    </div>
  );
};

export default ConversationPanel;
