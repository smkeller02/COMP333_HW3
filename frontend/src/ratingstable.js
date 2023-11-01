import React, { useState, useEffect } from "react";
import UpdateRating from './updaterating';
import DeleteRating from './deleterating';
import './Ratings.css';
import AddNewRating from './addnewrating';
import GetRatingData from './searchfilterratings'; 


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
    setUpdateRating(null);
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

  function TopRatedSongs({ ratings }) {
    // Sort the ratings in descending order based on the star rating value (select the top five)
    const topRatedSongs = [...ratings].sort((a, b) => b.rating - a.rating).slice(0, 5);
  
    return (
      <div>
        <h2>Top Rated Songs</h2>
        <ul>
          {topRatedSongs.map((song) => (
            <li key={song.id}>{song.song} by {song.artist} - Rating: {song.rating}</li>
          ))}
        </ul>
      </div>
    );
  }
  
  function AverageSongRatings({ ratings }) {
    // calculate total rating and the number of ratings
    const totalRatings = ratings.length;
    const totalRatingValue = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    // in edge case, where there is no rating
    const averageRating = totalRatings > 0 ? (totalRatingValue / totalRatings).toFixed(2) : 0;
  
    return (
      <div>
        <h2>Average Song Ratings</h2>
        <p>Average Rating: {averageRating}</p>
      </div>
    );
  }

  function SongsPerArtist({ ratings }) {
    const artistCounts = {};
    // Iterate through the ratings to count the songs per artist.
    ratings.forEach((rating) => {
      artistCounts[rating.artist] = (artistCounts[rating.artist] || 0) + 1;
    });
  
    return (
      <div>
        <h2>Number of Songs per Artist</h2>
        <ul>
          {Object.entries(artistCounts).map(([artist, count]) => (
            <li key={artist}>
              {artist}: {count} {count === 1 ? 'song' : 'songs'} {/* song if 1, songs if more than 1*/}
            </li>
          ))}
        </ul>
      </div>
    );
  }


  return (
    <div className="RatingsTable">
      <h1>Welcome! <br/> This is {user}'s Rating Table</h1>
      <GetRatingData/>
      <ul>
        {ratings.map((rating) => (
          <div className="ratings-preview" key={rating.id}>
            <strong>{rating.song}</strong> by {rating.artist}
            <p>{renderStars(rating.rating)}</p>
            <p>rated by: {rating.username}</p>
            {isSongCreatedByUser(rating) && (
              <div className="button-container">
                {updateRating && updateRating.id === rating.id && updateRating.username === rating.username ? (
                  <UpdateRating ratingId={updateRating.id} user={updateRating.username} onDataChanged={handleDataChange} isUpdateMode={true} />
                ) : (
                  // <button onClick={() => handleUpdate(rating)}>Update</button>
                  <span onClick={() => handleUpdate(rating)} className="icon-button">
                    <i className="fas fa-pencil-alt"></i> {/* Pencil icon for Update */}
                  </span>
                )}
                <span onClick={() => handleDelete(rating)} className="icon-button">
                  <i className="fas fa-trash-alt"></i> {/* Trashcan icon for Delete */}
                </span>
              </div>
            )}
            {/* {updateRating && updateRating.id === rating.id && updateRating.username === rating.username && (
              <UpdateRating ratingId={updateRating.id} user={updateRating.username} onDataChanged={handleDataChange}/>
            )} */}
            {deleteRating && deleteRating.id === rating.id && (
              <DeleteRating ratingId={deleteRating.id} onDelete={() => handleDelete(rating) } onDataChanged={handleDataChange} />
            )}
            <hr/>
          </div>
        ))}
      </ul> 

      {/* Statistics Components */}
      <TopRatedSongs ratings={ratings} />
      <AverageSongRatings ratings={ratings} />
      <SongsPerArtist ratings={ratings} />
    </div>
  )
}

export default Ratings;
