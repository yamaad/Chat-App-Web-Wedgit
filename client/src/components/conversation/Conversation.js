import "./Conversation.css";
const Conversation = ({ costumerName }) => {
  return (
    <div className="convestaion">
      <p>
        <strong>{costumerName}</strong>
      </p>
    </div>
  );
};

export default Conversation;
