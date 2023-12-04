import { useEffect, useState } from "react";
import "./Conversation.css";
import { useDispatch, useSelector } from "react-redux";
import { setConversation } from "../../redux/conversationSlice";
import {
  deleteLastMessage,
  selectLastMessages,
} from "../../redux/lastMessageSlice";
const Conversation = ({ conversation }) => {
  const [customer, setCustomer] = useState(null);
  const activeClassName = conversation.is_active ? "active" : "";
  const selectedConversation = useSelector(
    (state) => state.conversation
  ).conversation;
  const [selectedClassName, setSelectedClassName] = useState("");
  const dispatch = useDispatch();
  const lastMessages = useSelector(selectLastMessages);
  useEffect(() => {
    updateSelectedClassName();
  }, [selectedConversation]);
  //fetch customers
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_API_URL + `/api/users/${conversation.user_id}`
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
    dispatch(deleteLastMessage({ conversationId: conversation._id }));
  };

  const updateSelectedClassName = () => {
    if (selectedConversation) {
      if (selectedConversation._id === conversation._id) {
        setSelectedClassName("selected");
      } else setSelectedClassName("");
    }
  };

  return (
    <>
      {customer && (
        <div
          className={`conversation ${activeClassName} ${selectedClassName}`}
          onClick={handleConversationClick}
        >
          <p>
            <strong>{customer.name}</strong>
          </p>
          <p>{lastMessages[conversation._id] ?? ""}</p>
        </div>
      )}
    </>
  );
};

export default Conversation;
