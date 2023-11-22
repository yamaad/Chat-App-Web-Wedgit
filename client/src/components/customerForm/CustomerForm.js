const { useState } = require("react");

const CustomerForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = (event) => {
    alert("submitted: " + name + email);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Name:
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="text"
            placeholder="Email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </label>
      </div>
      <div>
        <input type="submit" value="Submit" />
      </div>
    </form>
  );
};
export default CustomerForm;
