import "./RouteMessages.css";
const RouteMessages = () => {
  return (
    <>
      <div className="settings">
        <h3>
          <input type="radio" name="chatbot" value={0} /> Route messages to
          chatbot
        </h3>
        <div className="chatbot-inputs">
          <label>
            <div>chatbot: URL</div>
            <input name="url" />
          </label>
          <label>
            <div>Auth token</div>
            <input name="token" />
          </label>
        </div>
        <h3>
          <input type="radio" name="agent" value={1} /> Route messages to live
          agents
        </h3>

        <label></label>
      </div>
    </>
  );
};
export default RouteMessages;
