import React, { useState } from "react";

function LoginUser({ onLoginSuccess }) {
    // State variables to manage user input and messages
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
 
  // Handles form submission
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server for user login
      let res = await fetch("http://localhost/COMP333_HW3/index.php/loginuser", {
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
        // If ok response, set sucess message, clear username/password, locally store username, and invoke callback function for successful login
        setMessage("Login successfull!");
        setUsername("");
        setPassword("");
        // Locally store username to use throughout frontend
        localStorage.setItem("user", username);
        // Invoke callback function for successful login
        onLoginSuccess();
      } else if (res.status === 400) {
          // If bad response, access the error message from backend
          setMessage(resJson.error);
      } else {
        // If other error, give generic error
        setMessage("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="LoginUser">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)} // Set userame from user input
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)} // Set password from user input
        />
        <button type="submit">Login</button>

        {/* Display success or error message, if present */}
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );

}
  
  export default LoginUser;