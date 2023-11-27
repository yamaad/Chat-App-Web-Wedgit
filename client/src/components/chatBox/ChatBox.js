import { useDispatch, useSelector } from "react-redux";
import Message from "../message/Message";
import "./ChatBox.css";
import { setMessages } from "../../redux/messagesSlice";
import { useEffect, useRef } from "react";
const ChatBox = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages).messages;
  const conversation = useSelector((state) => state.conversation).conversation;
  const chatBoxRef = useRef(null);

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
