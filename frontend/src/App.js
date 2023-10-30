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

function App() {
  const [user, setUser] = useState(""); // To store the logged-in user
  const [loggedIn, setLoggedIn] = useState(false);

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

  return (
    <Router>
      <div>
        {/* <ul>
          <li>
            <Link to="/ratingstable">Ratings</Link>
          </li>
          <li>
            <Link to="/deleterating">Delete Rating</Link>
          </li>
          <li>
            <Link to="/addnewrating">Add New Rating</Link>
          </li>
          <li>
            <Link to="/updaterating">Update Rating</Link>
          </li>
          <li>
            <Link to="/viewrating">View Rating</Link>
          </li>
          <li>
            <Link to="/loginuser">Login</Link>
          </li>
          <li>
            <Link to="/createuser">Sign Up</Link>
          </li>
        </ul> */}
        <div className="app-container">
          <div className="main-content">
            <Routes>
              <Route path="/ratingstable" element={<Ratings />} />
            </Routes>
          </div>
          <div className="sidebar-right">
          {!loggedIn && (
            <div className="login_signin">
              <div className="login">
                <strong>Log In</strong>
                {/* Render the "Login" button if the user is not logged in */}
                {!loggedIn && (
                  <LoginUser />
                )}
              </div>

              <div className="signin">
                <strong>Sign In</strong>
                {/* Render the "Sign Up" component if the user is not signed in */}
                {!loggedIn && (
                  <CreateUser />
                )}
              </div>
            </div>
          )}

            {/* Render the "Exit" button if a user is logged in */}
            {loggedIn && (
              <button className="exit-button" onClick={handleLogout}>
                Exit
              </button>
            )}

            {loggedIn && (
              <div className="add-song-rating">
                <strong>Add New Song Rating</strong>
                <AddNewRating />
              </div>
            )}
          </div>
      </div>

        <hr />

        {/* <Routes>
          <Route path="/ratingstable" element={<Ratings />} />
          <Route path="/deleterating" element={<DeleteRating />} />
          <Route path="/addnewrating" element={<AddNewRating />} />
          <Route path="/updaterating" element={<UpdateRating />} />
          <Route path="/viewrating" element={<ViewRating />} />
          <Route path="/loginuser" element={<LoginUser />} />
          <Route path="/createuser" element={<CreateUser />} />
        </Routes> */}
      </div>
    </Router>
  );
}


/*
  const [page, setPage] = useState("ratings")

  // Render the component based on the current page state
  const renderPage = () => {
    switch (page) {
      case "ratings":
        return <Ratings />;
      case "createuser":
        return <CreateUser />;
      case "loginuser":
        return <LoginUser />;
      case "viewrating":
        return <ViewRating />;
      case "deleterating":
        return <DeleteRating />;
      case "addnewrating":
        return <AddNewRating />;
      case "updaterating":
        return <UpdateRating />;
      default:
        return <Ratings />;
    }
  };

  return (
    <div>
      <ul>
        <li onClick={() => setPage("ratings")}>Ratings</li>
        <li onClick={() => setPage("createuser")}>Create User</li>
        <li onClick={() => setPage("loginuser")}>Login User</li>
        <li onClick={() => setPage("viewrating")}>View Rating</li>
        <li onClick={() => setPage("deleterating")}>Delete Rating</li>
        <li onClick={() => setPage("addnewrating")}>Add New Rating</li>
        <li onClick={() => setPage("updaterating")}>Update Rating</li>
      </ul>
      {renderPage()}
    </div>
  );
}
*/

export default App;