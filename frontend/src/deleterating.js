import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";

function DeleteRating({ ratingId }) {
  //NOTE HERE THE USER SHOULDN'T NEED TO INSERT ID, 
  //SHOULD ONLY NEED TO CLICK ON SONG IN RATINGS TABLE AND DELETE PAGE WILL SHOW UP
  //BACKEND DOES NEED ID TO RUN THOUGH
  // const [username, setUsername] = useState("");
  // const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  //const navigate = useNavigate();
 
  let handleSubmit = async (e) => {
  //   setUsername(localStorage.getItem("user"));
  //   e.preventDefault();
    try {
      const username = localStorage.getItem("user");
      let res = await fetch("http://localhost/COMP333_HW3/index.php/deleterating", {
        method: "DELETE",
        body: JSON.stringify({
          "username": username,
          "id": ratingId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let resJson = await res.json();
      if (res.status === 200) {
        // setUsername("");
        // setId("");
        setMessage("Rating Deleted");
        // Redirect user to ratings page
        //navigate("/ratingstable");
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
    <div className="DeleteRating">
      {/* <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={id}
          placeholder="Id"
          onChange={(e) => setId(e.target.value)}
        />
        <button type="submit">Delete</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form> */}
      <p>Are you sure you want to delete this rating?</p>
      <button onClick={handleSubmit}>Delete</button>
      <button onClick={() => setMessage("")}>Cancel</button>

      <div className="message">{message ? <p>{message}</p> : null}</div>
    </div>
  );
  }
  
  export default DeleteRating;