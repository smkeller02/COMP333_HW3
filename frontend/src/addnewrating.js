import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddNewRating() {
  //NOTE: USER SHOULD NOT HAVE TO PUT IN USERNAME, NEED TO ADD PHP SESSION IN BACKEND
  const [username, setUsername] = useState("");
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("http://localhost/COMP333_HW3/index.php/addnewrating", {
        method: "POST",
        body: JSON.stringify({
          "username": username,
          "artist": artist,
          "song" : song,
          "rating" : rating
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setUsername("");
        setArtist("");
        setSong("");
        setRating("");
        setMessage("Rating added");
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
    <div className="LoginUser">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          value={artist}
          placeholder="Artist"
          onChange={(e) => setArtist(e.target.value)}
        />
         <input
          type="text"
          value={song}
          placeholder="Song"
          onChange={(e) => setSong(e.target.value)}
        /> 
        <input
        type="text"
        value={rating}
        placeholder="Rating"
        onChange={(e) => setRating(e.target.value)}
      />
        <button type="submit">Add rating</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );

  }
  
  export default AddNewRating;