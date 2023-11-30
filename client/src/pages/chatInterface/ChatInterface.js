import { useEffect, useState } from "react";
import ChatBar from "../../components/chatBar/ChatBar";
import ChatBox from "../../components/chatBox/ChatBox";
import ConversationPanel from "../../components/conversationsPanel/ConversationsPanel";
import Navbar from "../../components/navbar/Navbar";
import "./ChatInterface.css";
import { AgentLogin } from "../../components/agentLogin/AgentLogin";
import { useSelector } from "react-redux";
import io from "socket.io-client";


const ChatInterface = () => {
  const socket = io.connect(process.env.REACT_APP_API_URL);
  const [conversations, setConversations] = useState([]);
  const agent = useSelector((state) => state.agent).agent;
  useEffect(() => {
    if (agent) {
      socket.emit("agent_room", agent._id);
    }
  }, [agent, socket]);

  useEffect(() => {
    if (agent) {
      try {
        const fetchConversations = async () => {
          const response = await fetch(
            process.env.REACT_APP_API_URL + `/api/conversations/${agent._id}`
          );
          const json = await response.json();
          if (response.ok) {
            setConversations([...conversations, ...json]);
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
          {
            <ConversationPanel
              conversations={conversations}
              socket={socket}
              setConversations={setConversations}
            />
          }
          <ChatBox socket={socket} />
          <ChatBar socket={socket} />
        </div>
      ) : (
        <AgentLogin />
      )}
    </>
  );
};
export default ChatInterface;
