import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        setUsername("");
        setPassword("");
        setMessage("Login successfull!");
        // Redirect user to ratings page
        navigate("/ratingstable");
      } else if (res.status === 400) {
          // Access the error message from backend
          setMessage(resJson.error);
      } else {
        setMessage("Something went wrong");
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
        <button type="submit">Login</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );

}
  
  export default LoginUser;