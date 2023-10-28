import React, { useState, useEffect } from "react";
import UpdateRating from './updaterating';
import DeleteRating from './deleterating';
import './Ratings.css';

function Ratings() {
  // State to hold the ratings data
  const [ratings, setRatings] = useState("");
  const user = localStorage.getItem("user");

  // State to track which rating should be updated or deleted
  const [updateRating, setUpdateRating] = useState(null);
  const [deleteRating, setDeleteRating] = useState(null);

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
    }, []);

  if (!ratings) {
    return null;
  }

  const isSongCreatedByUser = (rating) => {
    // determine if the song is created by the logged-in user
    return user === rating.username;
  };

  const handleUpdate = (rating) => {
    // Toggle the selected rating when the user clicks the "Update" button
    setUpdateRating((prevSelected) =>
      prevSelected === rating ? null : rating
    );
    setDeleteRating(null);
  };

  const handleDelete = (rating) => {
    // Toggle the selected rating when the user clicks the "Delete" button
    setDeleteRating((prevSelected) =>
      prevSelected === rating ? null : rating
    );
    setUpdateRating(null);
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
            {isSongCreatedByUser(rating) && (
              <div>
                <span onClick={() => handleUpdate(rating)} className="update-icon">
                  Update
                </span>
                <span onClick={() => handleDelete(rating)} className="delete-icon">
                  Delete
                </span>
              </div>
            )}
            {updateRating && updateRating.id === rating.id && (
              <div>
                {updateRating === rating ? (
                  <UpdateRating ratingId={updateRating.id} />
                ) : null
              }
              </div>
            )}
            {deleteRating && deleteRating.id === rating.id && (
              <div>
                {deleteRating === rating ? (
                  <DeleteRating ratingId={deleteRating.id} />
                ) : null
              }
              </div>
            )}
          </div>
        ))}
      </ul> 
    </div>
  )
}

export default Ratings;
