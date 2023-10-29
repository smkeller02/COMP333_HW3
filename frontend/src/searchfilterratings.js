import React, { useState, useEffect } from "react";

function GetRatingData() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    // set search query to empty string
    const [q, setQ] = useState("");
    // set search parameters
    const [searchParam] = useState(["username", "artist", "song", "rating"]);
    // set filter param
    const [filterParam, setFilterParam] = useState(["All"]);
  
  
  
    useEffect(() => {
      fetch("http://localhost/COMP333_HW3/index.php/ratings")
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result);
          },
          // Catch any errors to display
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, []);
  
    // filter items - use array property .some() to return an item even if other requirements didn't match
    function filterItems() {
      return items.filter((item) => {
        if (!q) {
          return true;
        } else {
          return searchParam.some(
            (newItem) =>
              item[newItem]?.toString().toLowerCase().includes(q.toLowerCase())
          );
        }
      });
    }
  
    if (error) {
      return <p>{error.message}</p>;
    } else if (!isLoaded) {
      return <p>loading...</p>;
    } else {
      return (
        <div className="wrapper">
          <div className="search-wrapper">
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
              <select
                onChange={(e) => setFilterParam(e.target.value)}
                className="custom-select"
                aria-label="Filter Ratings By..."
              >
                <option value="All">No Filter</option>
                <option value="username">User</option>
                <option value="artist">Artist</option>
                <option value="song">Song</option>
                <option value="rating">Rating</option>
              </select>
              <span className="focus"></span>
            </div>
          </div>
          <ul className="RatingsTable">
            {filterItems().map((item) => (
              <li key={item.id}>
                <div className="ratings-preview">
                  <strong>{item.song}</strong> by {item.artist}
                  <p>rating: {item.rating}</p>
                  <p>rated by: {item.username}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }
}

  export default GetRatingData;