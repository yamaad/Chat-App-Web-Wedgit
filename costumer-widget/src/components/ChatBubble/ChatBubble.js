import "./ChatBubble.css";
import { RiMessengerLine } from "react-icons/ri";
const ChatBubble = ({ onClick }) => {
  return (
    <div className="chat-bubble" onClick={onClick}>
      <RiMessengerLine />
    </div>
  );
};

export default ChatBubble;
