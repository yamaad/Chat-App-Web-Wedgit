import { useSelector } from "react-redux";
import Message from "../message/Message";
import "./ChatBox.css";
const ChatBox = () => {
  const messages = useSelector((state) => state.messages).messages;
  return (
    <div className="chat-box">
      {messages &&
        messages.map((message, index) => {
          return <Message key={index} message={message} />;
        })}
    </div>
  );
};
export default ChatBox;
