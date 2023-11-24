import { useEffect, useState } from "react";
import "./Conversation.css";
const Conversation = ({ conversation }) => {
  const [customer, setCustomer] = useState(null);

  //fetch customers
  useEffect(() => {
    console.log("logs", conversation);

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
    <div className="conversation">
      <p>{customer && <strong>{customer.name}</strong>}</p>
    </div>
  );
};

export default Conversation;
