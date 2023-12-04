import Conversation from "../conversation/Conversation";
import { useEffect } from "react";
import "./ConversationsPanel.css";

const ConversationPanel = ({
  conversations,
  socket,
  setConversations,
  fetchConversations,
}) => {
  useEffect(() => {
    //listen to existing conversation
    if (conversations) {
      joinConversation();
    }
    //listen for new conversation
    socket.on("new_conversation", handleNewConversation);
    //listen for conversation ending
    socket.on("end_conversation", handleEndConversation);
    socket.on("receive_message", pushConversationTop);
    return () => {
      socket.off("new_conversation", handleNewConversation);
      socket.off("end_conversation", handleEndConversation);
      socket.off("receive_message", pushConversationTop);
    };
  }, [conversations]);
  const pushConversationTop = (messageData) => {
    const filteredConversations = conversations.filter(
      (conversation) => conversation._id !== messageData.conversation_id
    );
    const lastUpdatedConversation = conversations.filter(
      (conversation) => conversation._id === messageData.conversation_id
    );
    setConversations([...lastUpdatedConversation, ...filteredConversations]);
  };
  const joinConversation = () => {
    conversations.map((conversation) => {
      if (conversation.is_active) {
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
  const handleScroll = (event) => {
    if (
      event.currentTarget.scrollTop + event.currentTarget.clientHeight ===
      event.currentTarget.scrollHeight
    )
      fetchConversations();
  };
  return (
    <div className="conversation-panel" onScroll={handleScroll}>
      {conversations &&
        conversations.map((conversation) => {
          return (
            <Conversation key={conversation._id} conversation={conversation} />
          );
        })}
    </div>
  );
};

export default ConversationPanel;
