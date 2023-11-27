import { useEffect, useState } from "react";
import "./Conversation.css";
import { useDispatch } from "react-redux";
import { setConversation } from "../../redux/conversationSlice";
const Conversation = ({ conversation }) => {
  const [customer, setCustomer] = useState(null);
  const activeConversation = conversation.is_active ? "active" : "";
  const dispatch = useDispatch();

  //fetch customers
  useEffect(() => {
    const fetchCustomer = async () => {
          try {
            const response = await fetch(
              process.env.REACT_APP_API_URL +
                `/api/users/${conversation.user_id}`
            );

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

  const handleConversationClick = () => {
    dispatch(setConversation(conversation));
  };

  return (
    <>
      {customer && (
        <div
          className={"conversation " + activeConversation}
          onClick={handleConversationClick}
        >
          <p>
            <strong>{customer.name}</strong>
          </p>
          <p>{conversation.end_time ?? conversation.start_time}</p>
        </div>
      )}
    </>
  );
};

export default Conversation;
