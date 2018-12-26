<?php
ob_start();
@session_start();

//$_SESSION['timeout'] = time();

date_default_timezone_set("Asia/Calcutta");
define('CDATE',date('Y-m-d H:i:s'));
define('DATE',date('Y-m-d'));
define('YEAR',date('Y'));
define('MONTH',date('m'));
define('DAY',date('d'));

define('ONSITE',false);

define('SMSFROM', 'GTCLUB');
define('SMSID', 'ssjewellers');
define('SMSPASS', 'SSjewellers@123');
define('SMSURL', 'http://182.18.160.225/index.php/api/bulk-sms?');

if(ONSITE)
{
	define('HOST','localhost');
	define('DBUSER','tenalidouble_tdhinvoice');
	define('DBPASS','tEnAALi@#323');
	define('DBNAME','tenalidouble_tdhinvoice');
}
else
{
	define('HOST','localhost');
	define('DBUSER','root');
	define('DBPASS','');
	define('DBNAME','tdhinvoice');
}

$con=mysqli_connect(HOST,DBUSER,DBPASS,DBNAME);

define('TABTITLE','Welcome to Tenali Double Horse');
define('LOGINLOGO','logo.png');
define('TABICON','favicon.ico');
define('SITETITLE','Tenali Double Horse');
define('COPYRIGHT','&copy; 2018 Admin');

define(SID,'invoiceapp');

define('USERS','users');
define('INVOICES','invoices');
define('INVOICEHISTORY','invoice_history');
define('DISTRIBUTORS','distributors');
define('AGENTS','agents');

function redirect($url){
?>
<script>
var hashval=window.location.hash;
if(hashval!='') window.location.href="<?php echo $url; ?>"+hashval; else window.location.href="<?php echo $url; ?>";
</script>
<?php
exit();
}

function getRecord($table,$where){
	global $con;
	if($where) $where=' where '.$where;
	$sql=mysqli_query($con, "select * from ".$table.$where);
	$count=@mysqli_num_rows($sql);
	if($count==1) {
		$rec=@mysqli_fetch_assoc($sql);
		return $rec;
	}
}

if(!empty($_SESSION[SID]))
{
	$user=getRecord(USERS,'id='.$_SESSION[SID]);
}
?>