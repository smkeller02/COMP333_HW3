import React, { useState } from "react";

function AddNewRating({onRatingAdded}) {
  // State variables to manage user input and messages
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
   // Retrieve the username of the logged-in user from local storage
  const username = localStorage.getItem("user");

  // handle the form submission
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to the server to add a new rating
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
         // If the response status is ok, clear artist, song, rating, set sucess message, notify the parent component that a new rating was added
        setArtist("");
        setSong("");
        setRating("");
        setMessage("Rating added");
        onRatingAdded();
        // Automatically clear the message after 2 seconds
        setTimeout(() => setMessage(""), 2000);
      } else if (res.status === 400) {
          // If resp is 400, access the error message from backend
          setMessage(resJson.error);
      } else {
        // else display generic error
        setMessage("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="AddNewRating">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={artist}
          placeholder="Artist"
          onChange={(e) => setArtist(e.target.value)} // Set artist to user input
        />
         <input
          type="text"
          value={song}
          placeholder="Song"
          onChange={(e) => setSong(e.target.value)} // Set song to user input
        /> 
        <input
        type="text"
        value={rating}
        placeholder="Rating"
        onChange={(e) => setRating(e.target.value)} // Set rating to user input
      />
      
        <button type="submit">Add rating</button>

        {/* Display success or error message, if present */}
        <div className="message">{message ? <p>{message}</p> : null}</div>
      </form>
    </div>
  );

  }
  
  export default AddNewRating;