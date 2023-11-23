import "./Message.css";
const Message = ({ message }) => {
  const sender = message.sender ? "agent" : "costumer";
  return (
    <div className={"message-box " + sender}>
      <div className="content">{message.content}</div>
      <div className="sent-at">{message.sentAt}</div>
    </div>
  );
};

export default Message;
