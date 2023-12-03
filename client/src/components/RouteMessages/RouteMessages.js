import { useEffect, useState } from "react";
import "./RouteMessages.css";

const RouteMessages = () => {
  const [chatOption, setChatOption] = useState();
  const [chatbotURL, setChatbotURL] = useState("");
  const [token, setToken] = useState("");
  const [availableAgents, setAvailableAgents] = useState([]);
  useEffect(() => {
    fetchCurrentChatOption();
    fetchAvailableAgents();
  }, []);
  const fetchCurrentChatOption = async () => {
    try {
      const chatOptionResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/organizations/chat-option`
      );
      const json = await chatOptionResponse.json();
      if (chatOptionResponse.ok) {
        if (json.chat_option === "organizationChatbot") {
          setChatOption(0);
          setChatbotURL(json.chatbot_URL);
        } else {
          setChatOption(1);
        }
      }
    } catch (error) {
      console.error("unable to fetch chat option, ERROR:", error);
    }
  };
  const fetchAvailableAgents = async () => {
    try {
      const agentsResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agents/online`
      );
      const agents = await agentsResponse.json();
      if (agentsResponse.ok) {
        setAvailableAgents(agents);
      }
    } catch (error) {
      console.error("unable to fetch available agents, ERROR:", error);
    }
  };
  const updateChatOption = async () => {
    const chatOptionRequest =
      chatOption === 0 ? "organizationChatbot" : "liveAgent";
    const request = {
      chat_option: chatOptionRequest,
      chatbot_URL: chatbotURL,
      chatbot_token: token,
    };
    try {
      const chatOptionResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/organizations/chat-option`,
        {
          method: "PATCH",
          body: JSON.stringify(request),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await chatOptionResponse.json();
      if (chatOptionResponse.ok) {
        if (json.chat_option === "organizationChatbot") {
          setChatOption(0);
        } else {
          setChatOption(1);
        }
      }
    } catch (error) {
      console.error("unable to fetch chat option, ERROR:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateChatOption();
  };

  return (
    <div className="route-messages">
      <form className="route-messages-form" onSubmit={handleSubmit}>
        <div>
          <h3>
            <input
              type="radio"
              id="routeToChatbot"
              name="routeOption"
              value={0}
              checked={chatOption === 0}
              onChange={() => setChatOption(0)}
            />
            <label htmlFor="routeToChatbot">Route messages to chatbot</label>
          </h3>
          <div className="chatbot-inputs">
            <label>
              <div>Chatbot URL</div>
              <input
                type="text"
                name="url"
                value={chatbotURL}
                disabled={chatOption == 1}
                onChange={(e) => setChatbotURL(e.target.value)}
              />
            </label>
            <label>
              <div>Auth token</div>
              <input
                type="text"
                name="token"
                value={token}
                disabled={chatOption == 1}
                onChange={(e) => setToken(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div>
          <h3>
            <input
              type="radio"
              id="routeToAgent"
              name="routeOption"
              value={1}
              checked={chatOption === 1}
              onChange={() => setChatOption(1)}
            />
            <label htmlFor="routeToAgent">Route messages to live agents</label>
          </h3>
        </div>

        <button
          type="submit"
          disabled={
            (chatOption === 0 && chatbotURL && token) ||
            (chatOption === 1 && availableAgents.length > 0)
              ? false
              : true
          }
        >
          Submit
        </button>
      </form>
      {chatOption == 1 && (
        <div className="available-agents">
          <h4>Available agents username:</h4>
          {!availableAgents.length > 0 && (
            <div>
              <p>
                <strong>no online agents...</strong>
              </p>
              <span>
                in the meanwhile messages will be routed to your chatbot if
                exists else will routed to openai GPT
              </span>
            </div>
          )}
          <ul>
            {availableAgents.map((agent, index) => {
              return (
                <li className="available-agent" key={index}>
                  {agent.username}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RouteMessages;
