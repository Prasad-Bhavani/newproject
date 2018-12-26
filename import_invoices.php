<?php
include_once('db/config.php');
if(isset($_POST['sub']))
{
	echo '<div align="center"><img src="images/upload.gif" /></div>';
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Import Inovices</title>
</head>
<body>

</body>
</html>
<?php
include_once('db/functions.php');
include_once('db/user_functions.php');
/** Set default timezone (will throw a notice otherwise) */
date_default_timezone_set('Asia/Kolkata');

include_once('fileupload/PHPExcel/IOFactory.php');

if(isset($_POST['sub']) && $_POST['sub']=='Submit')
{
	if(isset($_FILES['file']['name'])){
		//$id=$_POST['id'];
		$file_name = $_FILES['file']['name'];
		$ext = pathinfo($file_name, PATHINFO_EXTENSION);
		
		//Checking the file extension
		if($ext == "xlsx"){
				
				$file_name = $_FILES['file']['tmp_name'];
				$inputFileName = $file_name;

			//  Read your Excel workbook
			try {
				$inputFileType = PHPExcel_IOFactory::identify($inputFileName);
				$objReader = PHPExcel_IOFactory::createReader($inputFileType);
				$objPHPExcel = $objReader->load($inputFileName);
			} catch (Exception $e) {
				die('Error loading file "' . pathinfo($inputFileName, PATHINFO_BASENAME) 
				. '": ' . $e->getMessage());
			}

			function colNotMatch()
			{
				return '<script>alert("Columns doesn\'t Match. Please try Again");window.close();</script>';
			}

			$sheet = $objPHPExcel->getSheet(0);
			$highestRow = $sheet->getHighestRow();
			$highestColumn = $sheet->getHighestColumn();

			$cols=array('B','C','D','E','F','G','H','I');
			$dbcols=array('Invoice Date','Inv. No','Trader Name','Invoice Refered By','Mobile Number','Quantity(QTS)','Total Amount','Discount(%)');

			$i=0;
			foreach($cols as $col)
			{
				$colval=$sheet->getCell($col.'1')->getValue();
				if($colval!=$dbcols[$i])
				{
					echo colNotMatch();
					exit();
				}
				$i=$i+1;
			}

			//  Loop through each row of the worksheet in turn
			for ($row = 2; $row <= $highestRow; $row++) {
				//  Read a row of data into an array
				$rowData = $sheet->rangeToArray('B' . $row . ':' . $highestColumn . $row,
				NULL, TRUE, FALSE);
				if(!empty($rowData[0][0])){
					$data=[];
					$dcheck=getRecord(DISTRIBUTORS, "distributor_name='".$rowData[0][2]."'");
					if(!empty($dcheck['id'])) $data['distributor_id']=$dcheck['id'];
					else
					{
						$disdata['distributor_name']=$rowData[0][2];
						//$disdata['city']=$rowData[0][2];
						if(!empty($rowData[0][4])) $disdata['contact_no']=$rowData[0][4];
						$disdata['created_date_time']=CDATE;
						$disdata['status']=1;
						$data['distributor_id']=addRecord(DISTRIBUTORS, $disdata);
					}
					if(!empty($rowData[0][3]))
					{
						$refCheck=getRecord(AGENTS, "name='".$rowData[0][3]."'");
						if(!empty($refCheck['id']))
						{
							$data['refered_by']=$refCheck['type'];
							$data['agent_id']=$refCheck['id'];
						}
						else
						{
							$refdata['name']=$rowData[0][3];
							$refdata['type']='Sales Officer';
							//$disdata['contact_no']=$rowData[0][3];
							$refdata['created_date_time']=CDATE;
							$refdata['status']=1;
							$data['refered_by']='Sales Officer';
							$data['agent_id']=addRecord(AGENTS, $refdata);
						}
					}
					else
					{
						$data['refered_by']='Direct';
					}
					$data['invoice_date']=date('Y-m-d', strtotime(\PHPExcel_Style_NumberFormat::toFormattedString($rowData[0][0], 'YYYY-MM-DD')));
					$data['invoice_number']=$rowData[0][1];
					$data['quantity']=str_replace(' QTS', '', $rowData[0][5]).' QTS';
					$data['total_amount']=$rowData[0][6];
					$data['balance_amount']=$rowData[0][6];
					//$data['balance_amount']=$rowData[0][7];
					if(!empty($rowData[0][7])) $data['discount']=$rowData[0][7];
					$data['created_date_time']=CDATE;
					$check=getQueryRecord("select id from ".INVOICES." where invoice_number=".$data['invoice_number']);
					if(empty($check))
					{
						$data['created_date_time']=CDATE;
						$data['created_by']=$_SESSION[SID];
						$res=addRecord(INVOICES, $data);
					}
					else
					{
						$data['updated_date_time']=CDATE;
						$data['updated_by']=$_SESSION[SID];
						$res=updateRecord(INVOICES, $data, "id=".$check['id']);
					}
					/*if(($rowData[0][7]-0)!=($rowData[0][6]-0))
					{
						if(empty($check)) $invoice_id=$res; else $invoice_id=$check['id'];
						$his=[];
						$his['invoice_id']=$invoice_id;
						$his['paid_amount']=$data['total_amount']-$data['balance_amount'];
						$his['paid_date']=CDATE;
						$his['payment_type']='Cash';
						$his['remarks']='';
						$his['updated_by']=$_SESSION[SID];
						$his['updated_date_time']=CDATE;
						
						addRecord(INVOICEHISTORY, $his);

						$paid=getQueryRecord("select sum(paid_amount) as paid_amount from ".INVOICEHISTORY." where invoice_id=".$invoice_id);
						$sql=getRecord(INVOICES, 'id='.$invoice_id);
						$up['balance_amount']=$sql['total_amount']-$paid['paid_amount'];
						if($up['balance_amount']<0) $up['balance_amount']=0; $up['balance_amount']=$up['balance_amount']; 
						$up['updated_date_time']=CDATE;
						updateRecord(INVOICES, $up, 'id='.$invoice_id);
					}*/	
				}
			}
				if($res)
				{
					echo '<script>alert("Successfully Invoices Imported");window.close();</script>';
				}
				else echo '<script>alert("Sorry Please try Again");window.close();</script>';
		}

		else{
			echo '<script>alert("Please upload file with xlsx extension only");window.close();</script>';
		}	
			
	}
}
else
{
	redirect('home#!/import_invoices');
}
?>
<style type="text/css">
p{
	display: inline;
}
</style>
<!--<h2>Excel File Uploader</h2>

<form enctype="multipart/form-data" target="_blank" method="post" action="paper.php">
	
	<label class="form-label span3" for="file">File</label>
	<input type="file" name="file" id="file" required />
	
	
	<br><br>
	<input type="submit" value="Submit" name="" id="" />

</form>-->