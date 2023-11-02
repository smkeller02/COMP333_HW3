import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from "react-router-dom";
import './App.css';
import Ratings from './ratingstable';
import LoginUser from './loginuser';
import CreateUser from './createuser';
import AddNewRating from './addnewrating';

function App() {
  const [user, setUser] = useState(""); // To store the logged-in user
  const [loggedIn, setLoggedIn] = useState(false);
  const [ratingDataChanged, setRatingDataChanged] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      setUser(loggedInUser);
      setLoggedIn(true);
    }
  }, []);

  // Dealing with logout pressed
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(""); // Clear the user state
    setLoggedIn(false); // Update the login status
  };

  // Handles refeshing data table with new data
  const refreshRatingsData = () => {
    setRatingDataChanged(!ratingDataChanged);
  };

  // Handles login status
  const handleLoginSuccess = () => {
    setLoggedIn(true); // Set the login status to true
  };

  return (
    <Router>
        <div className="app-container">
        {(!loggedIn && (
          // Display login and signup options if not logged in
          <div className="login-signup-center">
            <strong className="big">Welcome to MusicUnited</strong>
            <br/><br/>
            <strong>Sign up / Log in to view the ratings!</strong>
            <br/><br/>
            <div className="login-signup">
              <LoginUser onLoginSuccess={handleLoginSuccess} /> {/* Display login form */}
              <CreateUser onCreateSuccess={handleLoginSuccess} /> {/* Display user registration form */}
            </div>
          </div>
        ))}

        {loggedIn && (
          // Display the main content if logged in
          <div className="main-content">
            <Routes>
            <Route path="/" element={ <Ratings DataChanged={ratingDataChanged} /> } />
              {/* Render Ratings component with prop indicating data changes */}
              <Route path="/ratingstable" element={<Ratings DataChanged={ratingDataChanged} />} />
              {/* Render AddNewRating component with callback for rating addition */}
              <Route path="/addnewrating" element={<AddNewRating onRatingAdded={refreshRatingsData} />} />
            </Routes>
          </div>
        )}

        {loggedIn && (
          // Display the right sidebar if logged in
          <div className="sidebar-right">
            <button className="exit-button" onClick={handleLogout}>
              Logout
            </button>

            <div className="add-song-rating">
              {/* Form for adding a new song rating with a callback on success */}
              <strong>Add New Song Rating</strong>
              <AddNewRating onRatingAdded={refreshRatingsData} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;