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
  useEffect(() => {
    console.log(conversations);
  }, [conversations]);
  useEffect(() => {
    return () => {
      dispatch(setConversation(null));
      dispatch(setMessages([]));
    };
  }, []);
  useEffect(() => {
    if (agent) {
      //TODO: implement this emit in the server-side
      socket.emit("agent_room", agent._id);
    }
  }, [agent, socket]);

  let ignore = false;
  useEffect(() => {
    if (agent && skip === 0 && conversations.length === 0) {
      console.log("fetch data is triggered twice", skip);
      //! fetch data is triggered twice here check if it happens on production
      if (!ignore) fetchConversations(0);
      return () => {
        ignore = true;
      };
    }
  }, [agent]);
  const fetchConversations = async () => {
    try {
      console.log("fetchConversations skip:", skip);
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
          {/* {conversation && ( */}
          <>
            <ChatBox socket={socket} conversation={conversation} />
            <ChatBar />
          </>
          {/* )} */}
        </div>
      ) : (
        <AgentLogin />
      )}
    </>
  );
};
export default ChatInterface;
