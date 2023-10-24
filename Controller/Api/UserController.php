<?php
class UserController extends BaseController
{
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