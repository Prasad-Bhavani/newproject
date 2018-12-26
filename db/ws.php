<?php
include_once('headers.php');

if($_SERVER['REQUEST_METHOD']=='POST'){

if(!empty($_SESSION[SID]))
{
	if($_GET['path']=='getFormData')
	{
		$distributors=getQueryRecords("select * from ".DISTRIBUTORS." order by distributor_name");
		//$cboys=getQueryRecords("select * from ".CBOYS." where status=1 order by cboy_name asc");

		//$data=array('distributors'=>$distributors,'distributors'=>$distributors,'cboys'=>$cboys);

		echo json_encode($distributors);
	}
	else
	if($_GET['path']=='getDistributors')
	{
		$recs=getQueryRecords("select * from ".DISTRIBUTORS." order by distributor_name asc");

		echo json_encode($recs);
	}
	else
	if($_GET['path']=='addDistributor')
	{
		extract($_POST);
		$data['distributor_name']=$distributor_name;
		if(!empty($contact_no)) $data['contact_no']=$contact_no; else $data['contact_no']='';
		if(!empty($alternative_nos)) $data['alternative_nos']=$alternative_nos; else $data['alternative_nos']='';
		$data['city']=$city;
		$data['address']=$address;
		if(empty($id)) $data['status']=1;
		if(empty($id)) $data['created_date_time']=CDATE;
		if(!empty($id)) $data['updated_date_time']=CDATE;

		if(empty($id)) $where='contact_no="'.$contact_no.'"';
		else $where='contact_no="'.$contact_no.'" and id!='.$id;

		$check=getDuplicate(DISTRIBUTORS,$where);
		if($check==0)
		{
			if(empty($id)) addRecord(DISTRIBUTORS, $data);
			else updateRecord(DISTRIBUTORS, $data, 'id='.$id);

			$result=1;
		}
		else $result=0;

		echo json_encode($result);
	}
	else
	if($_GET['path']=='changeDistributorStatus')
	{
		extract($_POST);
		$data['status']=$status;
		$data['updated_date_time']=CDATE;
		updateRecord(DISTRIBUTORS,$data,'id='.$id);

		$recs=getQueryRecords("select * from ".DISTRIBUTORS." order by distributor_name asc");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getDistributor')
	{
		extract($_POST);
		$rec=getRecord(DISTRIBUTORS,'id='.$id);

		echo json_encode($rec);
	}
	else
	if($_GET['path']=='getAgentsByType')
	{
		$recs=getQueryRecords("select * from ".AGENTS." where type='".$type."' order by name asc");

		echo json_encode($recs);
	}
	else
	if($_GET['path']=='getAgents')
	{
		$recs=getQueryRecords("select * from ".AGENTS." order by name asc");

		echo json_encode($recs);
	}
	else
	if($_GET['path']=='addAgent')
	{
		extract($_POST);
		$data['name']=$name;
		$data['type']=$type;
		if(!empty($contact_no)) $data['contact_no']=$contact_no; else $data['contact_no']='';
		if(!empty($alternative_nos)) $data['alternative_nos']=$alternative_nos; else $data['alternative_nos']='';
		//$data['city']=$city;
		$data['area']=$area;
		if(empty($id)) $data['status']=1;
		if(empty($id)) $data['created_date_time']=CDATE;
		if(!empty($id)) $data['updated_date_time']=CDATE;

		if(empty($id)) $where='contact_no="'.$contact_no.'"';
		else $where='contact_no="'.$contact_no.'" and id!='.$id;

		$check=getDuplicate(AGENTS,$where);
		if($check==0)
		{
			if(empty($id)) addRecord(AGENTS, $data);
			else updateRecord(AGENTS, $data, 'id='.$id);

			$result=1;
		}
		else $result=0;

		echo json_encode($result);
	}
	else
	if($_GET['path']=='changeAgentStatus')
	{
		extract($_POST);
		$data['status']=$status;
		$data['updated_date_time']=CDATE;
		updateRecord(AGENTS,$data,'id='.$id);

		$recs=getQueryRecords("select * from ".AGENTS." order by name asc");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getAgent')
	{
		extract($_POST);
		$rec=getRecord(AGENTS,'id='.$id);

		echo json_encode($rec);
	}
	else
	if($_GET['path']=='getUsers')
	{
		$recs=getQueryRecords("select * from ".USERS." where id!=1 order by id asc");

		echo json_encode($recs);
	}
	else
	if($_GET['path']=='addUser')
	{
		extract($_POST);
		$data['username']=$username;
		$data['contact_number']=$contact_number;
		$data['address']=$address;
		if(empty($id)) $data['status']=0;
		if(empty($id)) $data['created_date_time']=CDATE;
		if(!empty($id)) $data['updated_date_time']=CDATE;

		if(empty($id)) $where='contact_number="'.$contact_number.'"';
		else $where='contact_number="'.$contact_number.'" and id!='.$id;

		$check=getDuplicate(USERS,$where);
		if($check==0)
		{
			if(empty($id)) $id=addRecord(USERS, $data);
			else updateRecord(USERS, $data, 'id='.$id);

			$up['userid']='USER'.str_pad($id,3,0,STR_PAD_LEFT);
			updateRecord(USERS, $up, 'id='.$id);

			$result=1;
		}
		else $result=0;

		echo json_encode($result);
	}
	else
	if($_GET['path']=='changeUserStatus')
	{
		extract($_POST);
		if($status==1)
		{
			sendUserActivationOtp($id);
			$data['status']='otp';
		}
		else
		{
			$data['status']=0;
			$data['updated_date_time']=CDATE;
			updateRecord(USERS,$data,'id='.$id);

			$data['recs']=getQueryRecords("select * from ".USERS." where id!=1 order by id asc");
			$data['status']='succ';
		}

		echo json_encode($data);
	}
	else if($_GET['path']=='getUser')
	{
		extract($_POST);
		$rec=getRecord(USERS,'id='.$id);

		echo json_encode($rec);
	}
	else
	if($_GET['path']=='addInvoice')
	{
		extract($_POST);
		foreach($objRecs as $rec)
		{
			extract($rec);
			$check=getRecord(INVOICES, 'invoice_number="'.$invoice_number.'"');
			if(empty($check['id']))
			{
				$data=[];
				$data['invoice_number']=$invoice_number;
				$data['distributor_id']=$distributor_id;
				$data['refered_by']=$refered_by;
				if($refered_by!='Direct') $data['agent_id']=$agent_id;
				$data['quantity']=str_replace(' QTS', '', $quantity).' QTS';
				$data['invoice_date']=date('Y-m-d', strtotime($invoice_date));
				$data['total_amount']=$total_amount;
				$data['balance_amount']=$balance_amount;
				$data['discount']=$discount;
				$data['created_by']=$_SESSION[SID];
				if(!empty($remarks)) $data['remarks']=$remarks;
				if(empty($id)) $data['created_date_time']=CDATE;
				if(!empty($id)) $data['updated_date_time']=CDATE;
				
				$invoice_id=addRecord(INVOICES, $data);

				if(($balance_amount-0)!=($total_amount-0))
				{
					$his=[];
					$his['invoice_id']=$invoice_id;
					$his['paid_amount']=$total_amount-$balance_amount;
					$his['paid_date']=CDATE;
					$his['payment_type']='Cash';
					$his['remarks']='';
					$his['updated_by']=$_SESSION[SID];
					$his['updated_date_time']=CDATE;
					
					addRecord(INVOICEHISTORY, $his);

					$paid=getQueryRecord("select sum(paid_amount) as paid_amount from ".INVOICEHISTORY." where invoice_id=".$invoice_id);
					$row=getRecord(INVOICES, 'id='.$invoice_id);
					$up['balance_amount']=$row['total_amount']-$paid['paid_amount'];
					$up['updated_date_time']=CDATE;
					updateRecord(INVOICES, $up, 'id='.$invoice_id);
				}	
			}

		}

		echo json_encode(1);
	}
	else
	if($_GET['path']=='editInvoice')
	{
		extract($_POST);

		$data['invoice_number']=$invoice_number;
		$data['distributor_name']=$distributor_name;
		$data['city']=$city;
		$data['mobile_no']=$mobile_no;
		$data['quantity']=str_replace(' QTS', '', $quantity).' QTS';;
		$data['invoice_date']=date('Y-m-d', strtotime($invoice_date));
		$data['total_amount']=$total_amount;
		$data['balance_amount']=$balance_amount;
		if(!empty($remarks)) $data['remarks']=$remarks;
		if(!empty($id)) $data['updated_date_time']=CDATE;
		
		updateRecord(INVOICES, $data, 'id='.$id);

		echo json_encode(1);
	}
	else
	if($_GET['path']=='getInvoices')
	{
		$recs=getQueryRecords("select d.distributor_name,d.contact_no,d.city,i.*,(case when i.balance_amount=0 then 'Paid' when i.balance_amount=i.total_amount then 'Pending' else 'Partially Pending' end) as payment_status,DATE_FORMAT(i.invoice_date, '%d-%b-%Y') as invoice_date,DATE_FORMAT(i.updated_date_time, '%d-%b-%Y') as updated_date,IFNULL((select name from ".AGENTS." where id=i.agent_id), 'Direct') as agent_name,IFNULL((select username from ".USERS." where id=i.updated_by), '') as updated_by from ".INVOICES." i,".DISTRIBUTORS." d where d.id=i.distributor_id order by i.id asc");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getInvoice')
	{
		extract($_POST);
		$rec=getQueryRecord("select *,DATE_FORMAT(invoice_date, '%d-%M-%Y') as invoice_date from ".INVOICES." where id=".$id);

		echo json_encode($rec);
	}
	else if($_GET['path']=='getInvoiceforUpdate')
	{
		extract($_POST);
		$rec=getQueryRecord("select cus.distributor_name,com.distributor_name,i.*,ROUND((i.total_amount-i.paid_amount), 2) as due_amount,DATE_FORMAT(i.invoice_date, '%d-%M-%Y') as invoice_date from ".INVOICES." i,".DISTRIBUTORS." cus,".DISTRIBUTORS." com where cus.id=i.distributor_id and com.id=i.distributor_id and i.id=".$invoiceid);
		$recs=getQueryRecords("select id,invoice_number from ".INVOICES." order by invoice_number asc");

		$data=array('rec'=>$rec,'recs'=>$recs);
		echo json_encode($data);
	}
	else if($_GET['path']=='getAgentInvoicesforPrint')
	{
		extract($_POST);

		$recs=getQueryRecords("select com.distributor_name,cus.distributor_name,cus.contact_no,i.*,DATE_FORMAT(i.invoice_date, '%d-%M-%Y') as invoice_date,ROUND(i.total_amount-i.paid_amount, 2) as due_amount from ".INVOICES." i,".DISTRIBUTORS." cus,".DISTRIBUTORS." com where com.id=i.distributor_id and cus.id=i.distributor_id and i.total_amount>i.paid_amount and i.assign_to=".$cboy_id." order by i.invoice_date asc");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getInvoicesBySearch')
	{
		extract($_POST);

		$where="where com.id=i.distributor_id and cus.id=i.distributor_id and i.total_amount>i.paid_amount and i.status=0 and i.assign_to=0";
		if(!empty($from_date)) $where.=" and i.invoice_date between '".date('Y-m-d', strtotime($from_date))."' and '".date('Y-m-d', strtotime($to_date))."'";
		if(!empty($limit)) $where.=" order by i.id asc limit ".$limit;

		$recs=getQueryRecords("select com.distributor_name,cus.distributor_name,i.*,DATE_FORMAT(i.invoice_date, '%d-%M-%Y') as invoice_date,ROUND(i.total_amount-i.paid_amount, 2) as due_amount from ".INVOICES." i,".DISTRIBUTORS." cus,".DISTRIBUTORS." com ".$where);

		echo json_encode($recs);
	}
	else if($_GET['path']=='assignInvoicestoAgent')
	{
		extract($_POST);
		foreach($recs as $id)
		{
			$updata['status']=1;
			$updata['assign_to']=$cboy_id;
			updateRecord(INVOICES,$updata,'id='.$id);
		}

		echo json_encode(1);
	}
	else if($_GET['path']=='getAgentInvoicesPendingbyDate')
	{
		extract($_POST);
		$recs=getQueryRecords("select id,invoice_number,(total_amount-paid_amount) as due_amount,'0' as paid_amount,'Cash' as pay_mode from ".INVOICES." where assign_to=".$cboy_id." and status=1");

		echo json_encode($recs);

	}
	else if($_GET['path']=='saveAgentInvoicesList')
	{
		extract($_POST);
		foreach($recs as $rec)
		{
			$data['invoice_id']=$rec['id'];
			$data['assign_to']=$cboy_id;
			$data['pay_date']=date('Y-m-d', strtotime($pay_date));
			$data['paid_amount']=$rec['paid_amount'];
			if(!empty($rec['remarks'])) $data['remarks']=$rec['remarks'];
			if($data['paid_amount']!=0) $data['pay_mode']=$rec['pay_mode']; else $data['pay_mode']='Not Paid';
			$data['created_date_time']=CDATE;

			addRecord(INVOICEHISTORY, $data);
			$amount=getQueryRecord("select sum(paid_amount) as paid from ".INVOICEHISTORY." where invoice_id=".$rec['id']);
			$up['paid_amount']=$amount['paid'];
			$up['status']=0;
			$up['assign_to']=0;
			$up['updated_date_time']=CDATE;
			updateRecord(INVOICES, $up, 'id='.$rec['id']);
		}

		echo json_encode(1);
	}
	else if($_GET['path']=='getCBoyswithInvoicesCount')
	{
		extract($_POST);

		$recs=getQueryRecords("select c.cboy_name,c.id,c.contact_no,count(i.id) as count from ".INVOICES." i,".CBOYS." c where c.id=i.assign_to and i.status=1 group by i.assign_to");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getDashboardList')
	{
		extract($_POST);

		$recs=getQueryRecords("select d.distributor_name,d.contact_no,d.city,i.*,sum(i.balance_amount) as balance_amount,sum(i.total_amount) as total_amount from ".INVOICES." i,".DISTRIBUTORS." d where d.id=i.distributor_id and i.balance_amount!=0 group by i.distributor_id");

		echo json_encode($recs);
	}
	else
	if($_GET['path']=='getStreets')
	{
		$recs=getQueryRecords("select * from ".STREETS." order by street_name asc");

		echo json_encode($recs);
	}
	else
	if($_GET['path']=='addStreet')
	{
		extract($_POST);
		$data['street_name']=$street_name;
		if(empty($id)) $data['status']=1;
		if(empty($id)) $data['created_date_time']=CDATE;

		if(empty($id)) $where='street_name="'.$street_name.'"';
		else $where='street_name="'.$street_name.'" and id!='.$id;

		$check=getDuplicate(STREETS,$where);
		if($check==0)
		{
			if(empty($id)) addRecord(STREETS, $data);
			else updateRecord(STREETS, $data, 'id='.$id);

			$result=1;
		}
		else $result=0;

		echo json_encode($result);
	}
	else
	if($_GET['path']=='changeStreetStatus')
	{
		extract($_POST);
		$data['status']=$status;
		updateRecord(STREETS,$data,'id='.$id);

		$recs=getQueryRecords("select * from ".STREETS." order by street_name asc");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getStreet')
	{
		extract($_POST);
		$rec=getRecord(STREETS,'id='.$id);

		echo json_encode($rec);
	}
	else if($_GET['path']=='getStreetsnotinBeats')
	{
		extract($_POST);
		$rec=getRecords(STREETS,'beat_id=0 order by street_name');

		echo json_encode($rec);
	}
	else
	if($_GET['path']=='addBeat')
	{
		extract($_POST);
		$data['beat_name']=$beat_name;
		if(empty($id)) $data['status']=1;
		if(empty($id)) $data['created_date_time']=CDATE;

		if(empty($id)) $where='beat_name="'.$beat_name.'"';
		else $where='beat_name="'.$beat_name.'" and id!='.$id;

		$check=getDuplicate(BEATS,$where);
		if($check==0)
		{
			if(empty($id)) $id=addRecord(BEATS, $data);
			else updateRecord(BEATS, $data, 'id='.$id);
			$result=1;
		}
		else $result=0;

		echo json_encode($result);
	}
	else if($_GET['path']=='getBeats')
	{
		extract($_POST);
		$recs=getQueryRecords("select * from ".BEATS." order by beat_name");

		echo json_encode($recs);
	}
	else
	if($_GET['path']=='changeBeatStatus')
	{
		extract($_POST);
		$data['status']=$status;
		updateRecord(BEATS,$data,'id='.$id);

		$recs=getQueryRecords("select * from ".BEATS." order by beat_name");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getBeat')
	{
		extract($_POST);
		$rec=getRecord(BEATS,'id='.$id);

		echo json_encode($rec);
	}
	else if($_GET['path']=='getStreetsinBeats')
	{
		extract($_POST);
		$recs=getRecords(STREETS, 'beat_id!=0');

		echo json_encode($recs);
	}
	else if($_GET['path']=='getInvoicesbyBeat')
	{
		extract($_POST);
		$recs=getQueryRecords("select i.*,r.distributor_name,d.distributor_name,sum(i.total_amount-i.paid_amount) as due_amount,DATE_FORMAT(i.invoice_date, '%d-%M-%Y') as invoice_date from ".INVOICES." i,".DISTRIBUTORS." r,".BEATS." b,".DISTRIBUTORS." d where r.id=i.distributor_id and d.id=i.distributor_id and b.id=".$beat_id." and i.assign_to=0 and i.status=0 group by i.id order by i.invoice_date asc");

		echo json_encode($recs);
	}
	else if($_GET['path']=='getCboysCollectedInvoicesList')
	{
		extract($_POST);
		$where="ih.assign_to=".$cboy_id;
		if(!empty($from_date)) $where.=" and ih.pay_date between '".date('Y-m-d', strtotime($from_date))."' and '".date('Y-m-d', strtotime($to_date))."'";

		$recs=getQueryRecords("select i.invoice_number,ih.*,DATE_FORMAT(ih.pay_date, '%d-%M-%Y') from ".INVOICEHISTORY." ih,".INVOICES." i where i.id=ih.invoice_id and ".$where." order by ih.pay_date asc");

		$amount=getQueryRecord("select sum(ih.paid_amount) as amount from ".INVOICEHISTORY." ih,".INVOICES." i where i.id=ih.invoice_id and ".$where);

		$data=array('recs'=>$recs,'amount'=>$amount['amount']);

		echo json_encode($data);
	}
	else if($_GET['path']=='sendSms')
	{
		extract($_POST);
		foreach($recs as $rec)
		{
			$message="Dear ".$rec['distributor_name']." your current Invoice (".$rec['invoice_number'].") outstanding amount of ".$rec['balance_amount']." is due. Request you to make Payment Immediately. Please ignore if already paid. Tenali Double Horse Minapagullu";
			$row=getRecord(DISTRIBUTORS, 'id='.$rec['distributor_id']);
			sendSMS($rec['contact_no'],$message);
			//echo $rec['contact_no'].'<br>';
			if(!empty($row['alternative_nos']))
			{
				$nos=explode(',', $row['alternative_nos']);
				foreach ($nos as $no) {
					sendSMS($no,$message);
					//echo $no.'<br>';
				}
			}
		}

		echo json_encode(1);
	}
	else if($_GET['path']=='getPendingInvoicesList')
	{
		extract($_POST);

		$recs=getQueryRecords('select d.distributor_name,d.contact_no,d.city,i.*,DATE_FORMAT(i.invoice_date, "%d-%b-%Y") as invoice_date,DATEDIFF(CURDATE(), i.invoice_date) as billdays from '.INVOICES.' i,'.DISTRIBUTORS.' d where d.id=i.distributor_id and i.balance_amount!=0 order by i.id asc');

		echo json_encode($recs);
	}
	else if($_GET['path']=='getInvoicesListByDate')
	{
		extract($_POST);

		$where='';
		if(!empty($refered_by)) $where.=' and i.refered_by="'.$refered_by.'"';
		if(!empty($from_date)) $where.=' and i.invoice_date between "'.date('Y-m-d', strtotime($from_date)).'" and "'.date('Y-m-d', strtotime($to_date)).'"';

		$recs=getQueryRecords('select d.distributor_name,d.contact_no,d.city,i.*,DATE_FORMAT(i.invoice_date, "%d-%b-%Y") as invoice_date,DATEDIFF(CURDATE(), i.invoice_date) as billdays from '.INVOICES.' i,'.DISTRIBUTORS.' d where d.id=i.distributor_id and i.balance_amount!=0 '.$where.' order by i.id asc');

		echo json_encode($recs);
	}
	else if($_GET['path']=='verifyOtp')
	{
		extract($_POST);
		$rec=getRecord(USERS,'id='.$id.' and otp="'.$otp.'"');
		if(empty($rec['id'])) $res=0;
		else
		{
			if(empty($rec['password']))
			{
				$data['password']=getOTP();
				sendSMS($rec['contact_number'], 'Dear '.$rec['username'].', your account has been created in Tenali Double Horse Invoices Application. Your Userid:'.$rec['userid'].' and password:'.$data['password']);
			}
			$data['status']=1;
			$data['updated_date_time']=CDATE;
			updateRecord(USERS,$data,'id='.$id);			
			$res=1;
		}
		
		echo json_encode($res);
	}
	else if($_GET['path']=='updateInvoice')
	{
		$data['invoice_id']=$id;
		$data['paid_amount']=$paid_amount;
		$data['paid_date']=date('Y-m-d', strtotime($paid_date));
		$data['payment_type']=$payment_type;
		$data['remarks']=$remarks;
		$data['updated_by']=$_SESSION[SID];
		$data['updated_date_time']=CDATE;
		
		addRecord(INVOICEHISTORY, $data);

		$paid=getQueryRecord("select sum(paid_amount) as paid_amount from ".INVOICEHISTORY." where invoice_id=".$id);
		$rec=getRecord(INVOICES, 'id='.$id);
		$up['balance_amount']=$rec['total_amount']-$paid['paid_amount'];
		$up['updated_date_time']=CDATE;
		updateRecord(INVOICES, $up, 'id='.$id);

		echo json_encode(1);	
	}
	else if($_GET['path']=='getInvoiceHistory')
	{
		$recs=getQueryRecords("select h.*,u.username from ".INVOICEHISTORY." h,".USERS." u where u.id=h.updated_by and h.invoice_id=".$invoiceid);

		echo json_encode($recs);
	}
	else if($_GET['path']=='getInvoiceListByDistributor')
	{
		$recs=getQueryRecords("select i.*,DATE_FORMAT(i.invoice_date, '%d-%b-%Y') as invoice_date,DATE_FORMAT(i.updated_date_time, '%d-%b-%Y') as updated_date_time,IFNULL((select name from ".AGENTS." where id=i.agent_id), 'Direct') as agent_name,u.username as created_by,IFNULL((select username from ".USERS." where id=i.updated_by), '') as updated_by from ".INVOICES." i,".USERS." u where u.id=i.created_by and i.distributor_id='".$distributor_id."' and i.balance_amount!=0 order by i.id asc");

		echo json_encode($recs);
	}
}
else echo json_encode(104);
}
?>