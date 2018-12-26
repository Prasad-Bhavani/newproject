<?php
if(empty($_SESSION[SID]))
{
	header('Location: ../index.php');
	exit;
}
?>