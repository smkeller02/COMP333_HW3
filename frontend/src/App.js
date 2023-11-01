import React, { useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';
import Ratings from './ratingstable';
import LoginUser from './loginuser';
import DeleteRating from './deleterating';
import CreateUser from './createuser';
import AddNewRating from './addnewrating';
import UpdateRating from './updaterating';
import ViewRating from './viewrating';
import Filters from './searchfilterratings'; 

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(""); // Clear the user state
    setLoggedIn(false); // Update the login status
  };

  const refreshRatingsData = () => {
    setRatingDataChanged(!ratingDataChanged);
  };

  const handleLoginSuccess = () => {
    setLoggedIn(true); // Set the login status to true
  };

  return (
    <Router>
        <div className="app-container">
        {(!loggedIn && (
          <div className="login-signup-center">
            <strong className="big">Welcome to MusicUnited</strong>
            <br/><br/>
            <strong>Sign up / Log in to view the ratings!</strong>
            <br/><br/>
            <div className="login-signup">
              <LoginUser onLoginSuccess={handleLoginSuccess} />
              <CreateUser />
            </div>
          </div>
        ))}

        {loggedIn && (
          <div className="main-content">
            <Routes>
              <Route path="/ratingstable" element={<Ratings DataChanged={ratingDataChanged} />} />
              <Route path="/addnewrating" element={<AddNewRating onRatingAdded={refreshRatingsData} />} />
            </Routes>
          </div>
        )}

        {loggedIn && (
          <div className="sidebar-right">
            <button className="exit-button" onClick={handleLogout}>
              Logout
            </button>
            <div className="add-song-rating">
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