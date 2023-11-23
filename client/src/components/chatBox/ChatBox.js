import Message from "../message/Message";
import "./ChatBox.css";
const ChatBox = ({ messages }) => {
  return (
    <div className="chat-box">
      {messages.map((message, index) => {
        return <Message key={index} message={message} />;
      })}
    </div>
  );
};
export default ChatBox;
