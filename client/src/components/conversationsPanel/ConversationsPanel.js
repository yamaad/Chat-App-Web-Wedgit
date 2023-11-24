import { useEffect, useState } from "react";
import Conversation from "../conversation/Conversation";
import "./ConversationsPanel.css";

const ConversationPanel = ({ conversations }) => {
  const [customers, setCustomers] = useState(null);

  //fetch customers
  useEffect(() => {
    if (conversations) {
      const fetchCustomers = async () => {
        try {
          const responsePromises = conversations.map(async (conversation) => {
            const response = await fetch(`/api/users/${conversation.user_id}`);
            const json = await response.json();
            return json;
          });
          const customerData = await Promise.all(responsePromises);

          setCustomers(customerData);
        } catch (error) {
          console.error("Error fetching customer data", error);
        }
      };
      fetchCustomers();
    }
  }, [conversations]);
  return (
    <div className="conversation-panel">
      {customers &&
        customers.map((customer, index) => {
          return <Conversation key={index} costumerName={customer.name} />;
        })}
    </div>
  );
};

export default ConversationPanel;
