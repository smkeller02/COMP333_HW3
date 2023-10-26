import React, { useState, useEffect } from "react";

function Ratings() {
  // State to hold the ratings data
  const [ratings, setRatings] = useState("");
  const user = localStorage.getItem("user");

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

  console.log(ratings)

  return (
    <div className="RatingsTable">
      <h1>Ratings</h1>
      <p>Welcome, {user}</p>
      <ul>
        {ratings.map((rating) => (
          <div className="ratings-preview" key={rating.id}>
            <h2>{rating.song}</h2>
            <p>by {rating.artist}</p>
            <p>rated by {rating.username}</p>
            <p>rating: {rating.rating}</p>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default Ratings;
