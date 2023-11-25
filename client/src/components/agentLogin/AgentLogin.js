import { useDispatch } from "react-redux";
import "./AgentLogin.css";
import { setAgent } from "../../redux/agentSlice";
import { useState } from "react";

export const AgentLogin = () => {
  const dispatch = useDispatch();
  const [username, setUsename] = useState("");
  const [error, setError] = useState("");

  const handleAgentLogin = async () => {
    const request = { username };
    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (response.ok) {
        dispatch(setAgent(json));
      }
    } catch (error) {
      setError(error);
    }
    setUsename("");
  };

  return (
    <div className="agent-login">
      <h3>Enter Agent Username</h3>
      <em>
        {" "}
        <small>
          {" "}
          <p>
            ** you can use this existing username: <strong>yamaad</strong>
          </p>
          <p>** you can enter a unique username to create a new agent user </p>
          <p>** you can refresh your browser to come back to this page </p>
        </small>
      </em>
      <label>
        <strong>username:</strong>
      </label>
      <input
        type="text"
        className="agent-login-input"
        onChange={(event) => setUsename(event.target.value)}
        value={username}
      />
      <button onClick={handleAgentLogin}>Enter</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};
