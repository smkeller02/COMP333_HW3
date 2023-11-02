import React, { useState, useEffect } from "react";
import UpdateRating from './updaterating';
import DeleteRating from './deleterating';
import './Ratings.css'


function Ratings(props) {
  // State to hold the ratings data
  const [ratings, setRatings] = useState([]);
  // Get username from local storage
  const user = localStorage.getItem("user");
  // Search query
  const [q, setQ] = useState("");
  // Filter parameter
  const [filterParam, setFilterParam] = useState('All');

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

  // Check if a song is created by the logged-in user
  const isSongCreatedByUser = (rating) => {
    // determine if the song is created by the logged-in user
    return user === rating.username;
  };

  // Handle updating a rating
  const handleUpdate = (rating) => {
    setUpdateRating(rating);
    setDeleteRating(null);
  };
  
  // Hangle canceling an update
  const handleCancelUpdate = () => {
    setUpdateRating(null);
  };

  // Hangle delete rating
  const handleDelete = (rating) => {
    if (isSongCreatedByUser(rating)) {
      // Toggle the selected rating when the user clicks the "Delete" button
      setDeleteRating((prevSelected) =>
        prevSelected === rating ? null : rating
      );
      setUpdateRating(null);
    }
  };

  // Handle canceling a delete request
  const handleCancelDelete = () => {
    setDeleteRating(null);
  };

  // Function to render star ratings
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

  // Component to display top-rated songs
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
  
  // Component to display average song ratings
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

    // Component to display the number of songs per artist
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

  // Function to filter the items based on the search query and filter parameter
  const filterItems = () => {
    return ratings.filter((rating) => {
      const searchTerms = q?.toLowerCase().trim();
      if (filterParam === "All") {
        return (
          searchTerms === "" ||
          rating.username?.toLowerCase().includes(searchTerms) ||
          rating.artist?.toLowerCase().includes(searchTerms) ||
          rating.song?.toLowerCase().includes(searchTerms) ||
          rating.rating?.toString().includes(searchTerms)
        );
      } else {
        const filterProperty = filterParam?.toLowerCase();
        return rating[filterProperty]?.toLowerCase().includes(searchTerms);
      }
    });
  };


  return (
    <div className="RatingsTable">
      <h1>Welcome! <br/> This is {user}'s Rating Table</h1>
      <div className="search-wrapper">
        {/* Input field for searching ratings */}
        <label htmlFor="search-form">
          <input
            type="search"
            name="search-form"
            id="search-form"
            className="search-input"
            placeholder="Search for..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="sr-only">Search ratings here</span>
        </label>
        <div className="select">
          {/* Dropdown for filtering ratings */}
          <select
            onChange={(e) => setFilterParam(e.target.value)}
            className="custom-select"
            aria-label="Filter Ratings By..."
          >
            {/* Filter by options */}
            <option value="All">No Filter</option>
            <option value="username">User</option>
            <option value="artist">Artist</option>
            <option value="song">Song</option>
            <option value="rating">Rating</option>
          </select>
          <span className="focus"></span>
        </div>
      </div>
      <ul>
        {/* Display ratings results */}
        {filterItems().map((rating) => (
          <div className="ratings-preview" key={rating.id}>
            <strong>{rating.song}</strong> by {rating.artist}
            <p>{renderStars(rating.rating)}</p>
            <p>rated by: {rating.username}</p>
            {isSongCreatedByUser(rating) && (
              <div className="button-container">
                {updateRating && updateRating.id === rating.id && updateRating.username === rating.username ? (
                  // If in update mode, render the UpdateRating component
                  <UpdateRating ratingId={updateRating.id} user={updateRating.username} onDataChanged={handleDataChange} isUpdateMode={true} />
                ) : (
                  // Render update icon to start the update process
                  <span onClick={() => handleUpdate(rating)} className="icon-button">
                    <i className="fas fa-pencil-alt"></i> {/* Pencil icon for Update */}
                  </span>
                )}
                {/* Render delete icon to start the delete process */}
                <span onClick={() => handleDelete(rating)} className="icon-button">
                  <i className="fas fa-trash-alt"></i> {/* Trashcan icon for Delete */}
                </span>
              </div>
            )}
            {deleteRating && deleteRating.id === rating.id && (
              // If in delete mode, render the DeleteRating component
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
