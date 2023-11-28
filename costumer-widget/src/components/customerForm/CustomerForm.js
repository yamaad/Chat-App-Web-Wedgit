import { useState } from "react";
import "./CustomerForm.css";
const CustomerForm = ({ setUser, setConversation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  //create conversation
  const createConversation = async (user_id) => {
    try {
      const conversation = await fetch(
        process.env.REACT_APP_API_URL + "/api/conversations",
        {
          method: "POST",
          body: JSON.stringify({ user_id }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await conversation.json();
      if (conversation.ok) {
        return json;
      }
    } catch (error) {
      console.error("Error creating a chat room:", error);
    }
  };
  //create user
  const createUser = async () => {
    try {
      const user = await fetch(process.env.REACT_APP_API_URL + "/api/users", {
        method: "POST",
        body: JSON.stringify({ name, email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await user.json();
      if (user.ok) {
        return json;
      }
    } catch (error) {
      console.error("Error creating chat user:", error);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && email) {
      const user = await createUser();
      const conversation = await createConversation(user._id);
      setUser(user);
      setConversation(conversation);
    }
  };

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <label>
        <strong>Name:</strong>
      </label>
      <input
        type="text"
        placeholder="Name"
        onChange={(event) => {
          setName(event.target.value);
        }}
      />

      <label>
        <strong>Email:</strong>
      </label>
      <input
        type="text"
        placeholder="Email"
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />

      <div>
        <input type="submit" value="Enter" />
      </div>
    </form>
  );
};
export default CustomerForm;
