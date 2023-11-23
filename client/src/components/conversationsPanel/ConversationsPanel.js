import Conversation from "../conversation/Converstaion";
import "./ConversationsPanel.css";

const ConversationPanel = ({ conversations }) => {
  return (
    <div className="conversation-panel">
      {conversations &&
        conversations.map((conversation, index) => {
          return <Conversation key={index} costumerName={conversation.uid} />;
        })}
    </div>
  );
};

export default ConversationPanel;
