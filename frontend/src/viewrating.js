import React, { useState, useEffect } from "react";

function ViewRating() {
  const [id, setId] = useState("");
  const [rated, setRated] = useState([]);
  const [message, setMessage] = useState("");
  
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
        setRated([]);
        setMessage(data.error);
      } else {
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
          onChange={(e) => setId(e.target.value)}
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
          {message ? <p>{message}</p> : ""}
    </div>
  </div>
  )
}
  
export default ViewRating;