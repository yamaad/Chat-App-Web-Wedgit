import { useEffect, useState } from "react";
import "./Conversation.css";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messagesSlice";
const Conversation = ({ conversation }) => {
  const [customer, setCustomer] = useState(null);
  const activeConversation = conversation.is_active ? "active" : "";
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages).messages;

  //fetch customers
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/users/${conversation.user_id}`);

        if (response.ok) {
          const customerData = await response.json();
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Error fetching customer data", error);
      }
    };
    fetchCustomer();
  }, [conversation]);

  //fetch chat history
  const fetchChat = async () => {
    try {
      const response = await fetch(`/api/messages/${conversation._id}`);
      if (response.ok) {
        const messagesData = await response.json();
        dispatch(setMessages(messagesData));
      }
    } catch (error) {
      console.error("Error fetching customer data", error);
    }
  };

  return (
    <div
      className={"conversation " + activeConversation}
      onClick={async () => fetchChat()}
    >
      {customer && (
        <>
          <p>
            <strong>{customer.name}</strong>
          </p>
          <p>{conversation.end_time ?? conversation.start_time}</p>
        </>
      )}
    </div>
  );
};

export default Conversation;
