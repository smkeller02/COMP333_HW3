import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function UpdateRating({ ratingId, user, onDataChanged}) {
  //NOTE: USER SHOULD NOT PUT IN ID, THAT SHOULD BE SENT TO BACKEND WHEN USER CLICKS - for now though, this is just a proof of concept
  // Values for update should auto fill with rating user clicked to update
  // const [id, setId] = useState("");
  //const [username, setUsername] = useState("");
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [dataChanged, setDataChanged] = useState(false);
  //const navigate = useNavigate();

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing rating data for the given ratingId
    if (ratingId) {
      fetch(`http://localhost/COMP333_HW3/index.php/viewrating?id=${ratingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => 
        response.json()
      )
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
        } else {
        setArtist(data[0].artist);
        setSong(data[0].song);
        setRating(data[0].rating);
        }
      })
      .catch((error) => {
        console.error("Error fetching ratings:", error);
      });
      }
    }, [ratingId]);

  const handleCancel = () => {
    // Hide the form and reset form fields when the cancel button is clicked
    setArtist("");
    setSong("");
    setRating("");
    setMessage("");
    setDataChanged(true);
  };
 
  let handleSubmit = async (e) => {
   // setUsername(localStorage.getItem("user"));
    e.preventDefault();
    try {
      let res = await fetch("http://localhost/COMP333_HW3/index.php/updaterating", {
        method: "POST",
        body: JSON.stringify({
          "id": ratingId,
          "username": user,
          "artist": artist,
          "song" : song,
          "rating" : rating
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let resJson = await res.json();
      console.log(user)
      console.log(ratingId)
      console.log(artist)
      if (res.status === 200) {
        // setId("");
        //setUsername("");
        // setArtist("");
        // setSong("");
        // setRating("");
        setMessage("Rating updated");
        onDataChanged();
        setDataChanged(true);
        // setShowForm(false);
        // Redirect user to ratings page
        setTimeout(() => setMessage(""), 2000);
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

  const handleUpdateClick = () => {
    setDataChanged(false); // Set dataChanged to false to show the form again
  };


  return (
    <div className="UpdateRating">
      {!dataChanged ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={artist}
            // placeholder="Artist"
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
          <div className="button-container-icon">
            <button type="submit">Update rating</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>

          <div className="message">{message ? <p>{message}</p> : null}</div>
        </form>
      ) : (
        // <button onClick={handleUpdateClick}>Update</button>
        <span onClick={handleUpdateClick} className="icon-button">
            <i className="fas fa-pencil-alt"></i> {/* Pencil icon for Update */}
        </span>
      )}
    </div>
  );
}
  
  export default UpdateRating;