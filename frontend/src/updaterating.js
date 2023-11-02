import React, { useState, useEffect } from "react";


function UpdateRating({ ratingId, user, onDataChanged}) {
  // State variables for artist, song, rating, and message
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  // State variable to control the visibility of the update form
  const [dataChanged, setDataChanged] = useState(false);

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
 
  // Handles submission of form
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server for updating rating
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
      if (res.status === 200) {
        // If ok response, set sucess message
        setMessage("Rating updated");
        onDataChanged(); // Trigger the parent component to refresh the data
        setDataChanged(true); // Set the dataChanged state to true to hide form
        setTimeout(() => setMessage(""), 2000); //Clear the success message after 2 seconds
      } else if (res.status === 400) {
          // If bad response, access the error message from backend
          setMessage(resJson.error);
      } else {
        // If other error, give generic message
        setMessage("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handles clicking update botton to show form
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
            onChange={(e) => setArtist(e.target.value)} // Set artist to input
          />
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)} // Set song to input
          />
          <input
            type="text"
            value={rating}
            onChange={(e) => setRating(e.target.value)} // Set rating to user input
          />
          <div className="button-container-icon">
            <button type="submit">Update rating</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </div>

          {/* Display success or error message if present */}
          <div className="message">{message ? <p>{message}</p> : null}</div>
        </form>
      ) : (
        <span onClick={handleUpdateClick} className="icon-button">
            <i className="fas fa-pencil-alt"></i> {/* Pencil icon for Update */}
        </span>
      )}
    </div>
  );
}
  
  export default UpdateRating;