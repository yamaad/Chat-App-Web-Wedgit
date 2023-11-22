import "./ChatBubble.css";

const ChatBubble = ({ onClick }) => {
  return (
    <div className="chat-bubble" onClick={onClick}>
      <span>Chat</span>
    </div>
  );
};

export default ChatBubble;
