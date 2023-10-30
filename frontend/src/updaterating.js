import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function UpdateRating({ ratingId }) {
  //NOTE: USER SHOULD NOT PUT IN ID, THAT SHOULD BE SENT TO BACKEND WHEN USER CLICKS - for now though, this is just a proof of concept
  // Values for update should auto fill with rating user clicked to update
  // const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  //const navigate = useNavigate();

  const navigate = useNavigate();
 
  let handleSubmit = async (e) => {
    setUsername(localStorage.getItem("user"));
    e.preventDefault();
    try {
      let res = await fetch("http://localhost/COMP333_HW3/index.php/updaterating", {
        method: "POST",
        body: JSON.stringify({
          "id": ratingId,
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
        // setId("");
        setUsername("");
        setArtist("");
        setSong("");
        setRating("");
        setMessage("Rating updated");
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
    <div className="UpdateRating">
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Update rating</button>

        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );
}
  
  export default UpdateRating;