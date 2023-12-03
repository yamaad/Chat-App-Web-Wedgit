import "./Message.css";
import { useEffect } from "react";
const Message = ({ message }) => {
  const sender = message.is_customer_message ? "costumer" : "agent";
  return (
    <div className={"message-box " + sender}>
      <div className="content">{message.content}</div>
      <div className="sent-at">{message.timestamp}</div>
    </div>
  );
};

export default Message;
