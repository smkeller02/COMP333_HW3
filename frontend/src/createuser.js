import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  let handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setMessage("Passwords dont match");
      return;
    }
    try {
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
        console.log("ok signup");
        // Locally store username to use throughout frontend
        setMessage("Sign up successfull! Now, Log in :) ");
        setUsername("");
        setPassword("");
        setPassword2("");
        setTimeout(() => setMessage(""), 4000);
        localStorage.setItem("user", username);
        // Redirect user to ratings page
        navigate("/ratingstable");
      } else if (res.status === 400) {
        // Access the error message from backend
        setMessage(resJson.error);
      } else {
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
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          value={password2}
          placeholder="Re-type Password"
          onChange={(e) => setPassword2(e.target.value)}
        />

        <button type="submit">Sign Up</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );

}
  
  export default CreateUser;