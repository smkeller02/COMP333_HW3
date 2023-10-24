<?php
class UserController extends BaseController
{
    public function updateratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
        // Check if the request method is POST
        if (strtoupper($requestMethod) == 'POST') {
            try {
                // Retrieve user regustration data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                if (!(array_key_exists('id', $postData) && array_key_exists('username', $postData) && array_key_exists('artist', $postData) && array_key_exists('song', $postData) && array_key_exists('rating', $postData))) {
                    $strErrorDesc = "Not all fields filled out";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    $id = $postData["id"];
                    $username = $postData["username"];
                    $artist = $postData["artist"];
                    $song = $postData["song"];
                    $rating = $postData["rating"];
                    $userModel = new UserModel();
                    $notRatedYet = $userModel->checkPreviouslyRated($id, $username, $artist, $song);
                    $usernameMatch = $userModel->checkUserAllowedToUpdate($username, $id);
                    $ratingUpdated = false;
                    // Check valid new rating input
                    if (!(($rating <= 5 && $rating >= 1) && $notRatedYet && $usernameMatch)) {
                        if (!($rating <= 5 && $rating >= 1)) {
                            $strErrorDesc = "Rating must be between 1 and 5";
                            $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                        } else if (!$notRatedYet) {
                            $strErrorDesc = "User already rated song+artist under different ID";
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

    public function addnewratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
        // Check if the request method is POST
        if (strtoupper($requestMethod) == 'POST') {
            try {
                // Retrieve user rating data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
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

    public function deleteratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
        // Check if the request method is DELETE
        if (strtoupper($requestMethod) == 'DELETE') {
            try {
                // Retrieve user regustration data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                if (!(array_key_exists('id', $postData))) {
                    $strErrorDesc = "Missing id number";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    $id = $postData["id"];
                    $userModel = new UserModel();
                    $ratingDeleted = false;
                    if ($userModel->checkIdExists($id)) {
                        $strErrorDesc = "id number not found";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    } else {
                        $userModel->deleteRating($id);
                        $ratingDeleted = true;
                    }
                    // Turn into array for better reading comprehension of output
                    $array = [
                        "rating deleted" => $ratingDeleted
                    ];
                    $responseData = json_encode($array);
                }
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

    public function viewratingAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
        // Check if the request method is GET
        if (strtoupper($requestMethod) == 'GET') {
            try {
                // Retrieve user regustration data from the request body
                $postData = json_decode(file_get_contents('php://input'), true);
                if (!(array_key_exists('id', $postData))) {
                    $strErrorDesc = "Missing id number";
                    $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                } else {
                    $id = $postData["id"];
                    $userModel = new UserModel();
                    if ($userModel->checkIdExists($id)) {
                        $strErrorDesc = "id number not found";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    } else {
                        $result = $userModel->getSingleRating($id);
                        $responseData = json_encode($result);
                    }
                }
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

    public function loginuserAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
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
                    $userModel = new UserModel();
                    $hashedpwd = $userModel->getUsersHashedPwd($username);
                    if(password_verify($password, $hashedpwd)){
                        $responseData = "{\"loggedIn\" : \"true\"}";
                    } else {
                        $strErrorDesc = "Login Failed";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    }
                }
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
    public function createuserAction() {
        // Get the request method (e.g., GET, POST, PUT, DELETE)
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        $arrQueryStringParams = $this->getQueryStringParams();
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
                    if (strlen($password) < 10) {
                        $strErrorDesc = "Password less than 10 characters";
                        $strErrorHeader = 'HTTP/1.1 400 Bad Request';
                    } else {
                        // Check if username is already in use
                        $userModel = new UserModel();
                        $existsResult = $userModel->checkUserExists($username);
                        if (!$existsResult) {
                            $userModel->createUser($username, password_hash($password, PASSWORD_DEFAULT));
                            $userCreated = true;
                        } else {
                            $userCreated = false;
                        }
                        // Turn into array for better reading comprehension
                        $array = [
                            "userExists" => $existsResult,
                            "userCreated" => $userCreated
                        ];
                        $responseData = json_encode($array);
                    }
                }
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
    public function ratingsAction()
    {
        $strErrorDesc = '';
        $requestMethod = $_SERVER["REQUEST_METHOD"];
        if (strtoupper($requestMethod) == 'GET') {
            try {
                $userModel = new UserModel();
                $arrUsers = $userModel->getRatings();
                $responseData = json_encode($arrUsers);
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
}

?>