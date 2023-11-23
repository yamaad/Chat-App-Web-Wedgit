import "./ChatBar.css";
const ChatBar = () => {
  return (
    <div className="chat-bar">
      <div className="chat-input">
        <input name="text" />
        <button>send</button>
      </div>
    </div>
  );
};

export default ChatBar;
