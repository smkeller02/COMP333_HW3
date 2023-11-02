import React, { useState } from "react";

function CreateUser({ onCreateSuccess }) {
  // State variables to manage user input and messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
 
  // Handle form submission
  let handleSubmit = async (e) => {
    e.preventDefault();
    // If passwords don't match, send error message
    if (password !== password2) {
      setMessage("Passwords dont match");
      return;
    }
    try {
      // Send a POST request to the server to create a new user
      let res = await fetch("http://localhost/COMP333_HW3/index.php/createuser", {
        method: "POST",
        body: JSON.stringify({
          "username": username,
          "password": password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let resJson = await res.json();
      if (res.status === 200) {
        // If status ok, set sucess message, clear variables, and locally store username to use throughout frontend
        setMessage("Sign up successfull! Now, Log in :) ");
        localStorage.setItem("user", username);
        setUsername("");
        setPassword("");
        setPassword2("");
        setTimeout(() => setMessage(""), 4000); // Clear the success message after 4 seconds
        onCreateSuccess();
      } else if (res.status === 400) {
        // If bad response, access the error message from backend
        setMessage(resJson.error);
      } else {
        // If other error, show generic message
        setMessage("error : ", res.status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="CreateUser">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)} // Set username from user input
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} // Set password from user input
        />
        <input
          type="password"
          value={password2}
          placeholder="Re-type Password"
          onChange={(e) => setPassword2(e.target.value)} // Set password2 from user input
        />

        <button type="submit">Sign Up</button>

        {/* Display success or error message, if present */}
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );

}
  
  export default CreateUser;