import { useDispatch, useSelector } from "react-redux";
import Message from "../message/Message";
import "./ChatBox.css";
import { addMessage, setMessages } from "../../redux/messagesSlice";
import { useEffect, useRef } from "react";
const ChatBox = ({ socket }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages).messages;
  const conversation = useSelector((state) => state.conversation).conversation;
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      if (conversation && messageData.conversation_id === conversation._id) {
        dispatch(addMessage(messageData));
      } else {
        //TODO: update unread messages
        //TODO: push that conversation to the top
        //TODO: style the selected messages
      }
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, dispatch, conversation]);
  useEffect(() => {
    if (conversation) {
      //fetch chat history
      const fetchChat = async () => {
        try {
          const response = await fetch(
            process.env.REACT_APP_API_URL + `/api/messages/${conversation._id}`
          );
          if (response.ok) {
            const messagesData = await response.json();
            dispatch(setMessages(messagesData));
          }
        } catch (error) {
          console.error("Error fetching customer data", error);
        }
      };

      fetchChat();
    }
  }, [conversation, dispatch]);

  // Use useEffect to scroll to the bottom when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box" ref={chatBoxRef}>
      {messages &&
        messages.map((message, index) => {
          return <Message key={index} message={message} />;
        })}
    </div>
  );
};
export default ChatBox;
