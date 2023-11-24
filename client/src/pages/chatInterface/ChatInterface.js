import { useEffect, useState } from "react";
import ChatBar from "../../components/chatBar/ChatBar";
import ChatBox from "../../components/chatBox/ChatBox";
import ConversationPanel from "../../components/conversationsPanel/ConversationsPanel";
import Navbar from "../../components/navbar/Navbar";
import "./ChatInterface.css";
import { AgentLogin } from "../../components/agentLogin/AgentLogin";
import { useSelector } from "react-redux";

const messages = [
  { content: "text1", sentAt: "2pm 12/14", sender: true },
  { content: "text2", sentAt: "2pm 12/14", sender: false },
  { content: "text3", sentAt: "2pm 12/14", sender: true },
  { content: "text4", sentAt: "2pm 12/14", sender: false },
  { content: "text5", sentAt: "2pm 12/14", sender: true },
  { content: "text6", sentAt: "2pm 12/14", sender: false },
];
const ChatInterface = () => {
  const [conversations, setConversations] = useState(null);
  const agent = useSelector((state) => state.agent);

  //fetch conversations
  useEffect(() => {
    if (agent) {
      const fetchConversations = async () => {
        const response = await fetch(`/api/agents/${agent._id}/conversations`);
        const json = await response.json();
        if (response.ok) {
          setConversations(json);
        }
      };
      fetchConversations();
    }
  }, [agent]);

  return (
    <>
      <Navbar path={"/"} page={"Setting Page"} />
      {agent ? (
        <div className="chat-Interface">
          <h3 className="chat-Interface-header">Customers</h3>
          {<ConversationPanel conversations={conversations} />}
          <ChatBox messages={messages} />
          <ChatBar />
        </div>
      ) : (
        <AgentLogin />
      )}
    </>
  );
};
export default ChatInterface;
