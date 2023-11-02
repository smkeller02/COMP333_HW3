import React, { useState } from "react";

function DeleteRating({ ratingId, onDataChanged }) {
    // State to manage the message displayed to the user
  const [message, setMessage] = useState("");
    // State to control the visibility of the delete confirmation form
  const [showForm, setShowForm] = useState(true);
 
  // Handles form submission
  let handleSubmit = async (e) => {
    try {
      // Get the username from local storage
      const username = localStorage.getItem("user");
      // Send a DELETE request to the server to delete the rating
      let res = await fetch("http://localhost/COMP333_HW3/index.php/deleterating", {
        method: "DELETE",
        body: JSON.stringify({
          "username": username,
          "id": ratingId
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      let resJson = await res.json();
      if (res.status === 200) {
        // If ok response, set appropriate message and trigger the parent component to refresh the data
        setMessage("Rating Deleted");
        onDataChanged(); 
      } else if (res.status === 400) {
          // If bad response, access the error message from backend
          setMessage(resJson.error);
      } else {
        // If other error, send generic message
        setMessage("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle cancellation and hide the form
  const handleCancel = () => {
    // Hide the form when the Cancel button is clicked
    setShowForm(false);
  };

  return (
    <div className="DeleteRating">
      {showForm ? (
        <>
          <p>Are you sure you want to delete this rating?</p>
          <button onClick={handleSubmit}>Delete</button>
          <button onClick={handleCancel}>Cancel</button>
          {/* Display success or error message, if present */}
          <div className="message">{message ? <p>{message}</p> : null}</div>
        </>
      ) : null}
    </div>
  );
  }
  
  export default DeleteRating;