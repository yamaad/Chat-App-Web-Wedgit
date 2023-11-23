import { useEffect, useState } from "react";
import "./ChatWindow.css";
import io from "socket.io-client";
import CustomerForm from "../customerForm/CustomerForm";

const socket = io.connect(`http://localhost:4000`);

const ChatWindow = ({ isOpen, onClose }) => {
  const [activeSession, setActiveSession] = useState(false);
  const [message, setMessage] = useState("");
  const [receiveMessage, setRecieveMessage] = useState("");

  const sendMessage = () => {
    socket.emit("send_message", { message });
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setRecieveMessage(data.message);
    });
  }, [socket]);
  return (
    <div className={`chat-window ${isOpen ? "open" : ""}`}>
      <div className="header">
        <span onClick={onClose}>&times;</span>
        <h2>Chat Window</h2>
      </div>
      {activeSession ? (
        <>
          <div>{receiveMessage}</div>
          <input
            placeholder="Message"
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <button onClick={sendMessage}>send</button>
        </>
      ) : (
        <>
          <CustomerForm />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
