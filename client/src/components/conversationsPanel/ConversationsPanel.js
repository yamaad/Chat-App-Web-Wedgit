import Conversation from "../conversation/Conversation";
import { useEffect } from "react";
import "./ConversationsPanel.css";
import { useDispatch } from "react-redux";
import { setConversation } from "../../redux/conversationSlice";

const ConversationPanel = ({ conversations, socket, setConversations }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    //listen to existing conversation
    if (conversations) {
      joinConversation();
    }
    //listen for new conversation
    socket.on("new_conversation", handleNewConversation);
    //listen for conversation ending
    socket.on("end_conversation", handleEndConversation);
    return () => {
      dispatch(setConversation(null));
      socket.off("new_conversation", handleNewConversation);
      socket.off("end_conversation", handleEndConversation);
    };
  }, [socket, conversations]);
  const joinConversation = () => {
    conversations.map((conversation) => {
      if (conversation.is_active) {
        console.log("agent joined conversation  :", conversation._id);
        socket.emit("join_conversation", conversation);
      }
    });
  };
  const isConversationExist = (conversationId) => {
    return conversations.some(
      (conversation) => conversation._id === conversationId
    );
  };
  const handleNewConversation = (newConversation) => {
    socket.emit("join_conversation", newConversation);
    if (!isConversationExist(newConversation._id))
      setConversations((prevConversations) => [
        newConversation,
        ...prevConversations,
      ]);
  };
  const handleEndConversation = async (conversationId) => {
    if (isConversationExist(conversationId)) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/conversations/${conversationId}`,
          {
            method: "PATCH",
          }
        );
        const updatedConversation = await response.json();
        if (response.ok) {
          const updatedList = conversations.map((conversation) =>
            conversation._id === conversationId
              ? updatedConversation
              : conversation
          );
          setConversations(updatedList);
        } else {
          console.error(
            "Unable to end conversation. Server responded with:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("unable to deactivation conversation, Error:", error);
      }
    }
  };
  return (
    <div className="conversation-panel">
      {conversations &&
        conversations.map((conversation, index) => {
          return <Conversation key={index} conversation={conversation} />;
        })}
    </div>
  );
};

export default ConversationPanel;
