<?php
$data=[];

function checkLogin()
{
	global $con;
	extract($_POST);

	$where='userid="'.mysqli_escape_string($con, trim($userid)).'" and password="'.mysqli_escape_string($con, $password).'"';
	$rec=getRecord(USERS,$where);

	if(isset($rec['id']) && !empty($rec['id']))
	{
		if($rec['status']==1)
		{
			$_SESSION[SID]=$rec['id'];
			$_SESSION['msg']='Welcome to Tenali Double Horse';
			$_SESSION['cls']='success';
			redirect('home');
		}
		else return 2;
	}
	else return 0;
}

?>