import { useEffect, useState } from "react";
import ChatBar from "../../components/chatBar/ChatBar";
import ChatBox from "../../components/chatBox/ChatBox";
import ConversationPanel from "../../components/conversationsPanel/ConversationsPanel";
import Navbar from "../../components/navbar/Navbar";
import "./ChatInterface.css";

const messages = [
  { content: "text1", sentAt: "2pm 12/14", sender: true },
  { content: "text2", sentAt: "2pm 12/14", sender: false },
  { content: "text3", sentAt: "2pm 12/14", sender: true },
  { content: "text4", sentAt: "2pm 12/14", sender: false },
  { content: "text5", sentAt: "2pm 12/14", sender: true },
  { content: "text6", sentAt: "2pm 12/14", sender: false },
];
const ChatInterface = () => {
  const [agents, setAgents] = useState(null);
  const [conversations, setConversations] = useState(null);

  //fetch online agents
  useEffect(() => {
    const fetchAgents = async () => {
      const response = await fetch("/api/agents/online");
      const json = await response.json();
      if (response.ok) {
        setAgents(json);
      }
    };
    fetchAgents();
  }, []);

  //fetch conversations
  useEffect(() => {
    if (agents) {
      const fetchConversations = async () => {
        const response = await fetch(
          `/api/agents/${agents[1]._id}/conversations`
        );
        const json = await response.json();
        if (response.ok) {
          setConversations(json);
        }
      };
      fetchConversations();
    }
  }, [agents]);
  return (
    <>
      <Navbar path={"/"} page={"Setting Page"} />

      <div className="chat-Interface">
        <h3 className="chat-Interface-header">Customers</h3>
        {<ConversationPanel conversations={conversations} />}
        <ChatBox messages={messages} />
        <ChatBar />
      </div>
    </>
  );
};
export default ChatInterface;
