import React, { useState, useEffect } from "react";

function ViewRating() {
  // State variables to manage user input, rated data, and messages
  const [id, setId] = useState("");
  const [rated, setRated] = useState([]);
  const [message, setMessage] = useState("");
  
  // Use the useEffect hook to fetch rated data when 'id' changes
  useEffect(() => {
    if (id) {
    fetch(`http://localhost/COMP333_HW3/index.php/viewrating?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data.error) {
        // If error in data, clear rated data and set an error message
        setRated([]);
        setMessage(data.error);
      } else {
        // If data is received successfully, update 'rated' state and clear the message
        setRated(data);
        setMessage("");
      }
    })
    .catch((error) => {
      setId("");
      console.error("Error fetching ratings:", error);
    });
    }
  }, [id]);

return (
  <div>
    <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="number"
          value={id}
          placeholder="Id"
          onChange={(e) => setId(e.target.value)} // Set id as given input
        />
    </form>
      
    <button type="submit">View Rating</button>
    
    {rated && ( // Check if rated is not null
        <div className="ViewRating">
          {rated.map((feature) => 
            <div className="ratings-preview" key={feature.id}>
              <h2>{feature.song}</h2>
              <p>by {feature.artist}</p>
              <p>rated by {feature.username}</p>
              <p>rating: {feature.rating}</p>
            </div>
            )
          }
      </div>
    )}

    <div className="message">
        {/* Display any error or success message */}
        {message ? <p>{message}</p> : ""}
    </div>
  </div>
  )
}
  
export default ViewRating;