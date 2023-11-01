import React, { useState, useEffect } from "react";
import UpdateRating from './updaterating';
import DeleteRating from './deleterating';
import './Ratings.css';
import AddNewRating from './addnewrating';

function Ratings(props) {
  // State to hold the ratings data
  const [ratings, setRatings] = useState("");
  const user = localStorage.getItem("user");

  // State to track which rating should be updated or deleted
  const [updateRating, setUpdateRating] = useState(null);
  const [deleteRating, setDeleteRating] = useState(null);
  const [dataChanged, setDataChanged] = useState(false); // Track changes

  const handleDataChange = (props) => {
    setDataChanged(!dataChanged); 
  };

  // Fetch ratings data from the API
  useEffect(() => {
    fetch("http://localhost/COMP333_HW3/index.php/ratings")
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        setRatings(data)
      })
      .catch((error) => {
        console.error("Error fetching ratings:", error);
      });
    }, [dataChanged, props.DataChanged]);

  if (!ratings) {
    return null;
  }

  const isSongCreatedByUser = (rating) => {
    // determine if the song is created by the logged-in user
    return user === rating.username;
  };

  const handleUpdate = (rating) => {
    setUpdateRating(rating);
    setDeleteRating(null);
  };
  
  const handleCancelUpdate = () => {
    setUpdateRating(null);
  };

  const handleDelete = (rating) => {
    if (isSongCreatedByUser(rating)) {
      // Toggle the selected rating when the user clicks the "Delete" button
      setDeleteRating((prevSelected) =>
        prevSelected === rating ? null : rating
      );
      setUpdateRating(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteRating(null);
  };

  console.log(ratings)

  const renderStars = (rating) => {
    const maxRating = 5; 

    // Create an array to store star elements
    const starArray = [];

    // Fill the stars based on the rating value
    for (let i = 1; i <= maxRating; i++) {
      if (i <= rating) {
        // Filled star
        starArray.push(
          <span key={i} className="star-filled" style={{ color: "yellow" }}>
            &#9733;
          </span>
        );
      } else {
        // Empty star
        starArray.push(
          <span key={i} className="star-empty" style={{ color: "gray" }}>
            &#9733;
          </span>
        );
      }
    }

    return (
      <div className="star-rating">{starArray}</div>
    );
  };

  return (
    <div className="RatingsTable">
      <h1>Ratings</h1>
      <p>Welcome, {user}</p>
      <ul>
        {ratings.map((rating) => (
          <div className="ratings-preview" key={rating.id}>
            <strong>{rating.song}</strong> by {rating.artist}
            <p>{renderStars(rating.rating)}</p>
            <p>rated by: {rating.username}</p>
            {isSongCreatedByUser(rating) && (
              <div>
                {updateRating && updateRating.id === rating.id && updateRating.username === rating.username ? (
                  <UpdateRating ratingId={updateRating.id} user={updateRating.username} onDataChanged={handleCancelUpdate} isUpdateMode={true} />
                ) : (
                  <button onClick={() => handleUpdate(rating)}>Update</button>
                )}
                <span onClick={() => handleDelete(rating)} className="delete-button">
                  Delete
                </span>
              </div>
            )}
            {/* {updateRating && updateRating.id === rating.id && updateRating.username === rating.username && (
              <UpdateRating ratingId={updateRating.id} user={updateRating.username} onDataChanged={handleDataChange}/>
            )} */}
            {deleteRating && deleteRating.id === rating.id && (
              <DeleteRating ratingId={deleteRating.id} onDelete={() => handleDelete(rating) } onDataChanged={handleDataChange} />
            )}
          </div>
        ))}
      </ul> 
    </div>
  )
}

export default Ratings;
