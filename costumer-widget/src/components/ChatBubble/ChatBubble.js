import "./ChatBubble.css";
import { RiMessengerLine } from "react-icons/ri";
import { IoMdCloseCircle } from "react-icons/io";
const ChatBubble = ({ onClick, isChatOpen }) => {
  return (
    <div className="chat-bubble" onClick={onClick}>
      {isChatOpen ? <IoMdCloseCircle /> : <RiMessengerLine />}
    </div>
  );
};

export default ChatBubble;
