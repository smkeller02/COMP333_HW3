<?php
// SYDNEY KELLER + MINJI WOO 
// smkeller@wesleyan.edu, mjwoo@wesleyan.edu

session_start();
class UserController extends BaseController
{
    // Logs out a user, destroys and resets PHP session
    public function logoutAction() {
        $_SESSION = array();
        session_destroy();
    }

    // Tells frontend if user logged in, if so, sends username, if not, sends 401 unauthorized error
    public function phpsessionAction() {
        $strErrorDesc = "";
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        if (strtoupper($requestMethod) == "GET") {
            try {
                if (isset($_SESSION['username'])) {
                    // Set responseData to users username to then send to frontend
                    $responseData = json_encode(['username' => $_SESSION['username']]);
                } else {
                    // No session data exists return HTTP 401 Unauthorized
                    $strErrorDesc = "Log in/sign up to view";
                    $strErrorHeader = 'HTTP/1.1 401 Unauthorized';
                }
            // Catch exception
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        // If not a GET request, give error message
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
        // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        } 
    }

    // Updates a users rating
    public function updateratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        // Check if the request method is POST
        if (strtoupper($requestMethod) == 'POST') {
            try {
                // Retrieve user registration data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                // Give error if user tries to submit empty data fields
                if (!(array_key_exists('id', $postData) && array_key_exists('username', $postData) && array_key_exists('artist', $postData) && array_key_exists('song', $postData) && array_key_exists('rating', $postData))) {
                    $strErrorDesc = "Not all fields filled out";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    // Get variables
                    $id = $postData["id"];
                    $username = $postData["username"];
                    $artist = $postData["artist"];
                    $song = $postData["song"];
                    $rating = $postData["rating"];
                    $ratingUpdated = false;
                    // Craete new UserModel and send requests to backend checking:
                        //if the user has already rated a song
                        //if the user is allowed to update (only if they initially created the rating)
                        //if the id given actually exists 
                    $userModel = new UserModel();
                    $notRatedYet = $userModel->checkPreviouslyRated($id, $username, $artist, $song);
                    $usernameMatch = $userModel->checkUserAllowedToUpdate($username, $id);
                    $checkId = $userModel->checkIdExists($id);
                    // If data passes all checks, update rathing, else give HTTP 400 and correct error message
                    if (!(($rating <= 5 && $rating >= 1) && $notRatedYet && $usernameMatch && !$checkId)) {
                        if (!($rating <= 5 && $rating >= 1)) {
                            $strErrorDesc = "Rating must be between 1 and 5";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        } else if (!$notRatedYet) {
                            $strErrorDesc = "User already rated song+artist under different ID";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        }else if ($checkId) {
                            $strErrorDesc = "Could not find ID";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        } else {
                            $strErrorDesc = "User did not create this rating and is not allowed to modify it";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        }
                    } else {
                        $userModel->updateRating($artist, $song, $rating, $id);
                        $ratingUpdated = true;
                    }
                    // Turn into array for better reading comprehension of output
                    $array = [
                        "rating updated" => $ratingUpdated
                    ];
                    $responseData = json_encode($array);
                }
            // Catch exception
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        // If request method isnt POST, send error
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
         // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        } 
    }

    // Adds a new rating to the database
    public function addnewratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        // Check if the request method is POST
        if (strtoupper($requestMethod) == 'POST') {
            try {
                // Retrieve user rating data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                // Give error if user tries to submit empty data fields
                if (!(array_key_exists('username', $postData) && array_key_exists('artist', $postData) && array_key_exists('song', $postData) && array_key_exists('rating', $postData))) {
                    $strErrorDesc = "Not all fields filled out";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    // All expected input received
                    $username = $postData["username"];
                    $artist = $postData["artist"];
                    $song = $postData["song"];
                    $rating = $postData["rating"];
                    $userModel = new UserModel();
                    // Checking that username is valid (already in database)
                    $existsResult = $userModel->checkUserExists($username); 
                    if (!$existsResult) {
                        $strErrorDesc = "User not in database, can not rate song";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    } else {
                        // Check for invalid rating number
                        if (!($rating <= 5 && $rating >= 1)) {
                            $strErrorDesc = "Rating must be between 1 and 5";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        } else {
                            $ratingAdded = false;
                            // Check if user has already rated song, if they have, send HTTP bad request
                            if (!($userModel->checkUserAlreadyRated($username, $artist, $song))) {
                                $strErrorDesc = "User already rated song";
                                $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                            } else {
                                $userModel->addRating($username, $artist, $song, $rating);
                                $ratingAdded = true;
                            }
                            // Turn into array for better reading comprehension of output
                            $array = [
                                "new rating added" => $ratingAdded
                            ];
                            $responseData = json_encode($array);
                        }
                    }
                }
            } catch (Exception $e) {

            }
        // If request method isnt POST, send error
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
         // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        } 
    }

    // Deletes a users given rating
    public function deleteratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        // Check if the request method is DELETE
        if (strtoupper($requestMethod) == 'DELETE') {
            try {
                // Retrieve user regustration data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                // Give error if user tries to submit empty data fields
                if (!(array_key_exists('id', $postData) && array_key_exists('username', $postData))) {
                    $strErrorDesc = "Missing id number or username";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    // Set up variables from postData
                    $id = $postData["id"];
                    $username = $postData["username"];
                    $ratingDeleted = false;
                    // Create new userModel and check if given id exits, if not, send error
                    $userModel = new UserModel();
                    if ($userModel->checkIdExists($id)) {
                        $strErrorDesc = "id number not found";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    } else {
                        // If id exists, check if user is allowed to delete (only if they initially created rating)
                        if ($userModel->checkUserAllowedToUpdate($username, $id)) {
                            // Delete rating
                            $userModel->deleteRating($id);
                            $ratingDeleted = true;
                        } else {
                            $strErrorDesc = "User did not create this rating and is not allowed to modify it";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        }
                    }
                    // Turn into array for better reading comprehension of output
                    $array = [
                        "rating deleted" => $ratingDeleted
                    ];
                    $responseData = json_encode($array);
                }
            // Catch exception
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        // If request method isnt POST, send error message
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
         // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        } 
    }

    // Shows data from a single given rating. Gets username, song, artist, and rating to be displayed by frontend
    public function viewratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        // Check if the request method is GET
        if (strtoupper($requestMethod) == 'GET') {
            try {
                // Retrieve user regustration data from the request body
                // Note: unlike other actions, viewAction recieves id in the uri:
                    //ex: http://localhost/COMP333_HW3/index.php/viewrating?id=8
                $id = isset($_GET['id']) ? $_GET['id'] : null;
                // if id not give, give proper error
                if (!$id) {
                    $strErrorDesc = "Missing id number";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    // Create new model and check given id is valid
                    $userModel = new UserModel();
                    if ($userModel->checkIdExists($id)) {
                        $strErrorDesc = "id number not found";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    } else {
                        // if id valid, get rating data and prepare to send to frontend
                        $result = $userModel->getSingleRating($id);
                        $responseData = json_encode($result);
                    }
                }
            // Catch excpetion
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        // If req method not GET, send error
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }

        // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    // Checks a given username and password against users datatable and "logs in" if found
    public function loginuserAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        // Check if the request method is POST
        if (strtoupper($requestMethod) == 'POST') {
            try {
                // Retrieve user regustration data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                // Give error if user tries to submit empty data fields
                if (!(array_key_exists('username', $postData) && array_key_exists('password', $postData))) {
                    $strErrorDesc = "Missing username/password";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    // All expected input received
                    $username = $postData["username"];
                    $password = $postData["password"];
                    // Create new UserModel and get users hashed password to check against
                    $userModel = new UserModel();
                    $hashedpwd = $userModel->getUsersHashedPwd($username);
                    // If hashed password matches with one from database, store username in PHP session and set responceData to logged
                        // getUserHashedPwd checks for valid username
                    if(password_verify($password, $hashedpwd)){
                        // Store the username in the session, set response data
                        $_SESSION['username'] = $username;
                        $responseData = "{\"loggedIn\" : \"true\"}";
                    } else {
                        // Give error message if passwords/username doesnt match database
                        $strErrorDesc = "Incorrect username/password";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    }
                }
            // Catch exception
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
         // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    // Create a user by entering username and hashed password into database
    public function createuserAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        // Check if the request method is POST
        if (strtoupper($requestMethod) == 'POST') {
            try {
                // Retrieve user regustration data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                if (!(array_key_exists('username', $postData) && array_key_exists('password', $postData))) {
                    $strErrorDesc = "Missing username/password";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    // All expected input received
                    $username = $postData["username"];
                    $password = $postData["password"];
                    // Check if given password is long enough, if not give error
                    if (strlen($password) < 10) {
                        $strErrorDesc = "Password less than 10 characters";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    } else {
                        // If password is long enough, check if username is already in use
                        $userModel = new UserModel();
                        $existsResult = $userModel->checkUserExists($username);
                        // If not, create user by inputting into database
                        if (!$existsResult) {
                            $userModel->createUser($username, password_hash($password, PASSWORD_DEFAULT));
                            $userCreated = true;
                            // Store the username in the session
                            $_SESSION['username'] = $username;
                        } else {
                            // If username taken, give proper warning and error message
                            $userCreated = false;
                            $strErrorDesc = "Username already taken";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        }
                        // Turn into array for better reading comprehension
                        $array = [
                            "userExists" => $existsResult,
                            "userCreated" => $userCreated,
                            "message" => $strErrorDesc
                        ];
                        $responseData = json_encode($array);
                    }
                }
            // Catch exception
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        // If request method isnt POST, send error
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
         // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }

    // Get all data from ratings table
    public function ratingsAction()
    {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        // Check req method is GET
        if (strtoupper($requestMethod) == 'GET') {
            try {
                // Create new UserModel and try getting all data from table
                $userModel = new UserModel();
                $arrUsers = $userModel->getRatings();
                $responseData = json_encode($arrUsers);
            // Catch exception
            } catch (Exception $e) {
                $strErrorDesc = $e->getMessage().'Something went wrong! Please contact support.';
                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';
            }
        // If req method not GET, show error
        } else {
            $strErrorDesc = 'Method not supported';
            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';
        }
        // send output
        if (!$strErrorDesc) {
            $this->sendOutput(
                $responseData,
                array('Content-Type: application/json', 'HTTP/1.1 200 OK')
            );
        } else {
            $this->sendOutput(json_encode(array('error' => $strErrorDesc)),
                array('Content-Type: application/json', $strErrorHeader)
            );
        }
    }
}

?>