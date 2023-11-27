import { useEffect, useState } from "react";
import ChatBar from "../../components/chatBar/ChatBar";
import ChatBox from "../../components/chatBox/ChatBox";
import ConversationPanel from "../../components/conversationsPanel/ConversationsPanel";
import Navbar from "../../components/navbar/Navbar";
import "./ChatInterface.css";
import { AgentLogin } from "../../components/agentLogin/AgentLogin";
import { useSelector } from "react-redux";

const ChatInterface = () => {
  const [conversations, setConversations] = useState([]);
  const agent = useSelector((state) => state.agent).agent;

  //TODO fetch conversations
  useEffect(() => {
    if (agent) {
            try {
              const fetchConversations = async () => {
                const response = await fetch(
                  process.env.REACT_APP_API_URL +
                    `/api/conversations/${agent._id}`
                );
                const json = await response.json();
                if (response.ok) {
                  setConversations(json);
                }
              };

              fetchConversations();
            } catch (error) {
              console.error("Error fetching conversation data", error);
            }
    }
  }, [agent]);

  return (
    <>
      <Navbar path={"/"} page={"Setting Page"} />
      {agent ? (
        <div className="chat-Interface">
          <h3 className="chat-Interface-header">Customers</h3>
          {<ConversationPanel conversations={conversations} />}
          <ChatBox />
          <ChatBar />
        </div>
      ) : (
        <AgentLogin />
      )}
    </>
  );
};
export default ChatInterface;
