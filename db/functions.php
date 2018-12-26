<?php

$entereddate=date("Y-m-d h:i:s");

function DBDATE($date){
	return date('Y-m-d H:i:s',strtotime($date));
}

function addRecord($table,$data){
	global $con;
	$colums="";
	$value="";
	foreach($data as $k=>$v){
		$colums .= $k.",";
		$value   .= "'".mysqli_real_escape_string($con, strtoupper(trim($v)))."',";
	}
	$colums=rtrim($colums,",");
	$value=rtrim($value,",");
	$ins="insert into ".$table." (".$colums.") values(".$value.")";
	if(@mysqli_query($con, $ins)) return @mysqli_insert_id($con);
	else die(mysqli_error($con));
}

function updateRecord($table,$data,$where=''){
	global $con;
	if($where) $where=' where '.$where;
	$rec="";
	foreach($data as $k=>$v){
		$rec.=$k."='".mysqli_real_escape_string($con, strtoupper(trim($v)))."',";
	}
	$rec=rtrim($rec,",");
	$update="update ".$table." set ".$rec.$where;
	if(@mysqli_query($con, $update)) return "Success";
	else die(mysqli_error());
}

function getDuplicate($table,$where=''){
	global $con;
	if($where) $where=' where '.$where;
	$sql = "select id from ".$table.$where;
	$run=@mysqli_query($con, $sql);
	return @mysqli_num_rows($run);
}

function parseArray($arr){
	
	return array_map(function($var) {    
    return is_numeric($var) ? (float)$var : $var;
	}, $arr);	
}

function getRecords($table,$where=''){
	global $con;
	$data=array();
	if($where) $where=" where ".$where; else $where=' order by id desc';
	$sql=@mysqli_query($con, "select * from ".$table.$where."");
	$count=@mysqli_num_rows($sql);
	if($count>0){
		while($rec=mysqli_fetch_assoc($sql)){
			$data[]=parseArray($rec);
		}
		return $data;
	}
	else return 0;
}

function getQueryRecord($query){
	global $con;
	$sql=@mysqli_query($con, $query);
	$count=@mysqli_num_rows($sql);
	if($count==1) {
		$rec=@mysqli_fetch_assoc($sql);
		return $rec;
	}
	else return $count;
}

function getQueryRecords($sql){
	global $con;
	$data=array();
	$run=@mysqli_query($con, $sql);
	$count=@mysqli_num_rows($run);
	if($count>0){
		while($rec=mysqli_fetch_assoc($run)){
			$data[]=$rec;
		}
		return $data;
	}
	else return 0;
}

function deleteRecord($table,$where=''){
	global $con;
	if($where) $where=' where '.$where;
	$sql=@mysqli_query($con, "delete from ".$table.$where);
	if($sql) return 1;
}

function getNextId($table){
	global $con;
	$sql=@mysqli_query($con, "select max(id) as id from ".$table);
	$id=@mysqli_fetch_array($sql);
	return $id['id']+1;
}

function randomPassword($length){
$chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	$pass="";
	for($i=0;$i<$length;$i++){
		$pass .=$chars[mt_rand(0, strlen($chars)-1)];
	}
	return $pass;
}

function arrayToString($data)
{
		$val="";
		foreach ($data as $value) {
			$val.=$value;
		}
		return rtrim($val,', ');
}

function getExtension($str)
{
	$i = strrpos($str,".");
	if (!$i) { return ""; } $l = strlen($str) - $i; $ext = substr($str,$i+1,$l);
	return $ext;
}

function imageCompress($source, $destination, $quality) {
		$info = getimagesize($source);
		if ($info['mime'] == 'image/jpeg') $image = imagecreatefromjpeg($source);
		elseif ($info['mime'] == 'image/gif') $image = imagecreatefromgif($source);
		elseif ($info['mime'] == 'image/png') $image = imagecreatefrompng($source);
		imagejpeg($image, $destination, $quality);
		return $destination;
}


function getDatesbetweenDates($start,$end,$holidays)
{
	$start = new DateTime($start);
	$end = new DateTime($end);
	$oneday = new DateInterval("P1D");

	$days = array();
	$data = "1";

	//$holidays=array('03-10-2017','05-10-2017');

	/* Iterate from $start up to $end+1 day, one day in each iteration.
	   We add one day to the $end date, because the DatePeriod only iterates up to,
	   not including, the end date. */

	foreach(new DatePeriod($start, $oneday, $end->add($oneday)) as $day) {
	    $day_num = $day->format("N"); /* 'N' number days 1 (mon) to 7 (sun) */
	    if($day_num < 7) { /* weekday */
	       if(!in_array($day->format("Y-m-d"), $holidays)) $days[$day->format("Y-m-d")] = $data;
	    }
	}    
	return $days;
}

function getDueAmount($fday,$lday)
{
	$due = getQueryRecord("select ROUND(sum(total_amount-paid_amount), 2) as due from ".SALE_INVOICES." where created_date_time between NOW() - INTERVAL ".$lday." DAY and NOW() - INTERVAL ".$fday." DAY");
	if(empty($due['due'])) $due['due']=0;
	return $due;
}

function sendSMS($phone_no,$msg)
{
    $ch = curl_init(SMSURL."username=".SMSID."&password=".SMSPASS."&to=".$phone_no."&message=".urlencode($msg)."&from=".SMSFROM);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $output = curl_exec($ch);
              curl_close($ch);
    return $output;
}

function getOTP(){
	return rand(1000,9999);
}

function sendUserActivationOtp($id)
{
	$rec=getRecord(USERS,'id='.$id);
	$admin=getRecord(USERS,'id=1');
	$data['otp']=getOTP();
	sendSMS($admin['contact_number'], 'Dear Admin, '.$rec['username'].' account activation OTP is '.$data['otp']);
	updateRecord(USERS,$data,'id='.$id);
}
?>