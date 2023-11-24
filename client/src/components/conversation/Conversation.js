import { useEffect, useState } from "react";
import "./Conversation.css";
const Conversation = ({ conversation }) => {
  const [customer, setCustomer] = useState(null);
  const activeConversation = conversation.is_active ? "active" : "";

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
  return (
    <div className={"conversation " + activeConversation}>
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
