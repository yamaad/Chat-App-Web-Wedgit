import "./Message.css";
import { useState, useEffect } from "react";
const Message = ({ message }) => {
  const sender = message.is_customer_message ? "costumer" : "agent";
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  useEffect(() => {
    formatTimestamp();
  }, []);
  const formatTimestamp = () => {
    const stringDate = new Date(message.timestamp);
    const date = stringDate.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    const time = stringDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    setFormattedDate(`${date}`);
    setFormattedTime(`${time}`);
  };
  return (
    <div className={"message-box " + sender}>
      <div className="content">{message.content}</div>
      <div className="sent-at">
        {message.is_customer_message ? (
          <small>
            {formattedTime} &ensp; {formattedDate}
          </small>
        ) : (
          <small>
            {formattedDate} &ensp; {formattedTime}
          </small>
        )}
      </div>
    </div>
  );
};

export default Message;
