<?php
// CORS
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
// Check if it's a preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
     // Respond to the preflight request with the appropriate headers
     header('Access-Control-Allow-Origin: *');
     header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
     header('Access-Control-Allow-Headers: *');
     http_response_code(200); // OK status
     exit; // Don't process the actual request, just the preflight
 }

require __DIR__ . "/inc/bootstrap.php";
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

//CORS headers
header('Access-Control-Allow-Origin:*'); //
$uri = explode( '/', $uri );
//for ( $i = 0; $i < count( $uri ); $i++ ) {
     //echo ("</br> $i " . $uri[$i] ."");
//}

// Get action from URI and pass to UserController
require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";
$objFeedController = new UserController();
$strMethodName = $uri[3] . 'Action';
//echo ('</br> uri[3]: ' . $uri[3] .'');
$objFeedController->{$strMethodName}();
?>