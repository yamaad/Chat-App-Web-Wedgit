import { useEffect, useState } from "react";
import ChatBar from "../../components/chatBar/ChatBar";
import ChatBox from "../../components/chatBox/ChatBox";
import ConversationPanel from "../../components/conversationsPanel/ConversationsPanel";
import "./ChatInterface.css";
import { AgentLogin } from "../../components/agentLogin/AgentLogin";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setConversation } from "../../redux/conversationSlice";
import { setMessages } from "../../redux/messagesSlice";
const socket = io.connect(process.env.REACT_APP_API_URL);

const ChatInterface = () => {
  const [conversations, setConversations] = useState([]);
  const agent = useSelector((state) => state.agent).agent;
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(0);
  const conversation = useSelector((state) => state.conversation).conversation;
  useEffect(() => {}, [conversations]);
  useEffect(() => {
    return () => {
      dispatch(setConversation(null));
      dispatch(setMessages([]));
    };
  }, []);
  useEffect(() => {
    if (agent) {
      socket.emit("agent_room", agent._id);
    }
  }, [agent, socket]);
let ignore = false;
  useEffect(() => {
    if (agent && skip === 0) {
      if (!ignore) fetchConversations(0);
    return () => {
      ignore = true;
    };
    }
  }, [agent]);
  const fetchConversations = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          `/api/conversations/${agent._id}?skip=${skip}&limit=15`
      );
      const json = await response.json();
      if (response.ok) {
        setSkip(skip + json.length);
        setConversations((prevConversation) => [...prevConversation, ...json]);
      }
    } catch (error) {
      console.error("Error fetching conversation data", error);
    }
  };
  return (
    <>
      {agent ? (
        <div className="chat-Interface">
          <h3 className="chat-Interface-header">Customers</h3>
          {
            <ConversationPanel
              conversations={conversations}
              socket={socket}
              setConversations={setConversations}
              fetchConversations={fetchConversations}
            />
          }
          <>
            <ChatBox socket={socket} conversation={conversation} />
            <ChatBar />
          </>
        </div>
      ) : (
        <AgentLogin />
      )}
    </>
  );
};
export default ChatInterface;
