import "./Message.css";
const Message = ({ message }) => {
  const sender = message.is_customer_message ? "agent" : "costumer";
  return (
    <div className={"message-box " + sender}>
      <div className="content">{message.content}</div>
      <div className="sent-at">{message.timestamp}</div>
    </div>
  );
};

export default Message;
