<?php
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