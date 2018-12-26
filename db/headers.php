<?php
include_once('config.php');
include_once('functions.php');

$postdata = file_get_contents("php://input");

$request = json_decode($postdata,true);

extract($request);

$result=array();

if($agent!="browser"){

	header("Access-Control-Allow-Origin: *");

	header("Content-Type: application/json; charset=UTF-8");

}
?>