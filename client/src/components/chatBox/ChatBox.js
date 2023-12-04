import { useDispatch, useSelector } from "react-redux";
import Message from "../message/Message";
import "./ChatBox.css";
import { addMessage, setMessages } from "../../redux/messagesSlice";
import { useEffect, useState, useRef } from "react";
import { setLastMessage } from "../../redux/lastMessageSlice";
const ChatBox = ({ socket, conversation }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages).messages;
  const [skip, setSkip] = useState(0);
  const chatBoxRef = useRef();
  const [pushScrollDown, setPushScrollDown] = useState(false);

  useEffect(() => {
    if (pushScrollDown) {
      console.log("pushScrollDown");
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      setPushScrollDown(false);
    }
  }, [pushScrollDown]);
  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [conversation]);
  useEffect(() => {
    //when new conversation is clicked only
    dispatch(setMessages([]));
    setSkip(0);
    if (skip === 0) {
      if (conversation) fetchChat();
    }
  }, [conversation]);
  useEffect(() => {
    //initial fetch chat history, render after a new conversation clicked & skip is reset to 0
    if (skip === 0) {
      if (conversation) fetchChat();
    }
  }, [skip]);
  useEffect(() => {
    if (messages.length < 21)
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);
  const handleReceiveMessage = (messageData) => {
    if (
      conversation ? conversation._id !== messageData.conversation_id : true
    ) {
      dispatch(
        setLastMessage({
          conversationId: messageData.conversation_id,
          lastMessage: messageData.content,
        })
      );
    }
    if (conversation) socket.emit("reset_timer", messageData.conversation_id);
    if (conversation && messageData.conversation_id === conversation._id) {
      dispatch(addMessage(messageData));
      setPushScrollDown(true);
      // scroll to bottom
    } else {
      //TODO: update unread messages
      //TODO: push that conversation to the top
    }
  };
  const fetchChat = async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL +
          `/api/messages/${conversation._id}?skip=${skip}&limit=20`
      );
      if (response.ok) {
        const messagesData = await response.json();

        setSkip(skip + messagesData.length);
        const newMessages = messagesData.filter(
          (message) =>
            !messages.some(
              (existingMessage) => existingMessage._id === message._id
            )
        );
        dispatch(setMessages([...newMessages, ...messages]));

        if (messagesData.length !== 0) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.clientHeight / 4;
        }
      }
    } catch (error) {
      console.error("Error fetching chat history", error);
    }
  };
  const handleScroll = (event) => {
    if (event.currentTarget.scrollTop === 0 && messages.length !== 0) {
      fetchChat();
    }
  };
  return (
    <div className="chat-box" onScroll={handleScroll} ref={chatBoxRef}>
      {messages &&
        messages.map((message) => {
          return (
            <Message key={message._id} message={message} setSkip={setSkip} />
          );
        })}
    </div>
  );
};
export default ChatBox;
