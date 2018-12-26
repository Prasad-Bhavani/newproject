app.controller('invoiceCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS,$timeout)
{
	angular.extend($scope,{
		obj:{},
		invoice:{},
		towns:{},
		isInvoices:true,
		submitted:false,
		isExist:false,
		companies:{},
		inobj:{},
		inrec:{},
		insubmitted:false,
		isInvoiceHistory:false,
		historyrecs:{},
		searchObj:{},
		searchSubmitted:false,
		selected:{},
		assignSubmitted:false,
		assignObj:{},
		invoiceRecs:0,
		objRecs:[],
		objsubmit:false,
		objRec:{},
		editObj:{},
		editSubmitted:false,
		updateObj:{},
		updateSubmitted:false,
		distObj:{}
	});
$scope.distObj={};
	angular.extend($scope,{
		subInvoice:function(formStatus)
		{
			$scope.submitted=true;
			if(formStatus)
			{
				if($scope.objRecs.length>0)
				{
					$scope.obj.objRecs=$scope.objRecs;
					if($scope.obj.id) MSG='Successfully Updated'; else MSG='Successfully Created';
					blockUI.start('Please wait...');
					dataService.getData('/ws/addInvoice',$scope.obj).then(function(response){
						if(response==1)
						{
							inform.add(MSG,{type:'success'});
							$timeout(function(){$('.modal-close').trigger('click');},0);
							$scope.getInvoices();
						}
						else $scope.obj.isExist=true;
					blockUI.stop();
					});
				}
				else
				{
					$scope.alertMsg="Add atleast one invoice";
					ngDialog.open({
			            template:'views/template/alert.html',
			            className: 'ngdialog-theme-default',
			            scope:$scope
				    }).closePromise.then(function(){
					});
				}
			}
		},
		searchForm:function(formStatus)
		{
			$scope.searchSubmitted=true;
			if(formStatus)
			{
				blockUI.start('Please wait...');
				dataService.getData('/ws/getInvoicesBySearch',$scope.searchObj).then(function(response){
					$scope.invoiceRecs=response;
				blockUI.stop();
				});
			}
		},
		getInvoiceids:function()
		{
			selectedInvoiceIds=[];
			$scope.assignObj.isCheck=false;
			angular.forEach($scope.selected.invoices, function(val,key){
				if(val==true) selectedInvoiceIds.push(key);
			});
			if(selectedInvoiceIds.length!=0) $scope.assign=true; else $scope.assign=false;
			if(selectedInvoiceIds.length==$scope.invoiceRecs.length) $scope.assignObj.isCheck=true;
		},
		assignInvoicestoAgent:function(formStatus)
		{
			$scope.assignSubmitted=true;
			if(formStatus)
			{
				$scope.assignObj.recs=selectedInvoiceIds;
				$scope.printRecs={};
				blockUI.start("Please wait...");
				dataService.getData('/ws/assignInvoicestoAgent',$scope.assignObj).then(function(response){
					inform.add('Successfully assigned', { type: 'success' });
					$scope.printRecs.cboy_name=$.grep($scope.cboys, function(v){
							return $scope.assignObj.cboy_id==v.id;
						})[0].cboy_name;
					$scope.printRecs.contact_no=$.grep($scope.cboys, function(v){
							return $scope.assignObj.cboy_id==v.id;
						})[0].contact_no;
					$scope.printRecs.invoices=[];
					angular.forEach(selectedInvoiceIds, function(v,k){
						console.log(v);
						var data=$.grep($scope.invoiceRecs, function(val){
							return val.id==v;
						})[0];
						$scope.printRecs.invoices.push(data);
					});
					console.log($scope.printRecs);
					$timeout(function(){$('.printAssignInvoices').trigger('click');},0);
					$scope.closeAssign();
					$scope.assignInvoices();
					blockUI.stop();
				});
				
			}
		},
		getInvoices:function()
		{
			$scope.obj={};
			$scope.objRecs=[];
			$scope.submitted=false;
			$scope.editObj={};
			$scope.editSubmitted=false;
			dataService.getData('/ws/getInvoices',{agent:"browser"}).then(function(response){
				recs=response;
				//inform.add('Data received from server', { type: 'success' });
				if(recs!=0)
				{
					angular.forEach(recs,function(val,key){
						recs[key].sno=key+1;
					});
					$scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: recs});
				}
				else $scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: ''});
			});
			$scope.isInvoices=true;
			$scope.isAdd=false;
			$scope.isInvoiceHistory=false;
		},
		changeStatus:function(id,status)
		{
			if(status==1) $scope.alertMsg='Are you sure you want to Active'; else $scope.alertMsg='Are you sure you want to Inactive';
			ngDialog.openConfirm({
			    template:'views/template/confirm.html',
		        className: 'ngdialog-theme-default',
		        scope:$scope,
		        closeByEscape:true
		   	}).then(function(){
		   		blockUI.start('Please Wait...');
		   		dataService.getData('/ws/changeInvoiceStatus',{id:id,status:status}).then(function(recs){
				inform.add('Invoice Status Successfully updated', { type: 'success' });
				if(recs!=0)
				{
					angular.forEach(recs,function(val,key){
						recs[key].sno=key+1;
					});
					$scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: recs});
				}
				else $scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: ''});
				blockUI.stop();
		   		});
		   	}).catch(function(){
		   	});
		},
		getInvoice:function(id)
		{
			blockUI.start('Loading...');
			$scope.updateSubmitted=false;
			$scope.updateObj={};
			dataService.getData('/ws/getInvoice',{id:id}).then(function(data){
				$scope.updateObj=data;
				$scope.updateObj.total_amount=$scope.updateObj.total_amount-0;
				$scope.updateObj.balance_amount=$scope.updateObj.balance_amount-0;
				ngDialog.openConfirm({
				    template:'views/template/updateinvoice.html',
			        className: 'ngdialog-theme-default custom-width-900',
			        scope:$scope,
			        closeByEscape:true
			   	}).then(function(){
			   	}).catch(function(){
			   	});
			blockUI.stop();
			});
		},
		getInvoiceforUpdate:function(invoiceid)
		{
			if(invoiceid!='')
			{
				dataService.getData('/ws/getInvoiceforUpdate',{invoiceid:invoiceid}).then(function(data){
					$scope.inrec=data.rec;
				});	
			}
		},
		getFormData:function()
		{
			dataService.getData('/ws/getFormData',{agent:"browser"}).then(function(response){
				$scope.distributors=response;
				/*$scope.retailers=response.retailers;
				$scope.cboys=response.cboys;*/
			});
		},
		addInvoice:function()
		{
			$scope.resetForm();
			$scope.isAdd=true;
			$scope.isInvoices=false;
		},
		resetForm:function()
		{
			$scope.submitted=false;
			$scope.obj={};
		},
		cancelAssign:function()
		{
			$scope.searchSubmitted=false;
			$scope.searchObj={};
			$scope.closeAssign();
			$scope.isInvoices=true;
		},
		closeAssign:function()
		{
			$scope.invoiceRecs=0;
			$scope.assignSubmitted=false;
			$scope.assignObj={};
			$scope.assign=false;
			selectedInvoiceIds=[];
			$scope.selected.invoices={};
			$scope.searchObj={};
			$scope.searchSubmitted=false;
		},
		assignInvoices:function()
		{
			$scope.searchObj={};
			blockUI.start('Please wait...');
			dataService.getData('/ws/getInvoicesBySearch',$scope.searchObj).then(function(response){
				$scope.invoiceRecs=response;
				$scope.isInvoices=false;
				$scope.searchObj={};
				$scope.isAdd=false;
				$scope.isInvoiceHistory=false;
			blockUI.stop();
			});
		},
		getInvoiceHistory:function(invoice)
		{
			blockUI.start("PLease wait...");
			dataService.getData('/ws/getInvoiceHistory',{invoiceid:invoice.id}).then(function(response){
				$scope.invoiceRec=invoice;
				$scope.historyrecs=response;
				$scope.isInvoiceHistory=true;
				$scope.isAdd=false;
				$scope.isInvoices=false;
				blockUI.stop();
			});
		},
		getClose:function()
		{
			$scope.invoiceRec={};
			$scope.historyrecs={};
			$scope.invoiceHistory=false;
			$scope.isInvoices=true;
		},
		addCustomer:function()
		{
			$timeout(function(){$('.modal-close').trigger('click');},0);
			window.location.href='home#!/customers';
		},
		checkAll:function()
		{
			if($scope.assignObj.isCheck)
			{
				selectedInvoiceIds=[];
				$scope.selected.invoices=[];
				angular.forEach($scope.invoiceRecs, function(val,key){
					$scope.selected.invoices[val.id]=true;
					selectedInvoiceIds.push(val.id);
				});
				if(selectedInvoiceIds.length!=0) $scope.assign=true; else $scope.assign=false;
			}
			else
			{
				selectedInvoiceIds=[];
				$scope.selected.invoices=[];
				if(selectedInvoiceIds.length!=0) $scope.assign=true; else $scope.assign=false;
			}
		},
		addObjtoRecs:function(formStatus)
		{
			console.log($scope.objRec);
			$scope.objsubmit=true;
			if(formStatus)
			{
				/*$scope.objRec.retailer_name=$.grep($scope.retailers, function(v){
							return $scope.objRec.retailer_id==v.id;
						})[0].retailer_name;*/
				/*$scope.objRec.distributor_name=$.grep($scope.distributors, function(v){
							return $scope.objRec.distributor_id==v.id;
						})[0].distributor_name;*/
				if($scope.objRec.refered_by!='Direct') $scope.objRec.agent_name=$.grep($scope.agents, function(v){
							return $scope.objRec.agent_id==v.id;
						})[0].name; else {$scope.objRec.agent_name='';$scope.objRec.agent_id='';}
				$scope.objRecs.push($scope.objRec);
				$scope.objRec={};	
				$scope.agents={};
				$scope.objRec.discount_percent=0;
				$scope.objsubmit=false;
			}
		},
		removeObj:function(index)
		{
			$scope.objRecs.splice(index, 1);
		},
		subEditInvoice:function(formStatus)
		{
			$scope.editSubmitted=true;
			if(formStatus)
			{
				MSG='Successfully Updated';
				blockUI.start('Please wait...');
				dataService.getData('/ws/editInvoice',$scope.editObj).then(function(response){
					if(response==1)
					{
						inform.add(MSG,{type:'success'});
						$timeout(function(){$('.modal-close').trigger('click');},0);
						$scope.getInvoices();
					}
				blockUI.stop();
				});
			}
		},
		subUpdateInvoice:function(formStatus)
		{
			$scope.updateSubmitted=true;
			if(formStatus)
			{
				MSG='Successfully Updated';
				blockUI.start('Please wait...');
				dataService.getData('/ws/updateInvoice',$scope.updateObj).then(function(response){
					if(response==1)
					{
						inform.add(MSG,{type:'success'});
						$timeout(function(){$('.modal-close').trigger('click');},0);
						$scope.getInvoices();
					}
				blockUI.stop();
				});
			}
		},
		getAgentsByType:function(type)
		{
			if(type!=undefined && type!='' && type!='Direct')
			{
				blockUI.start('Loading...');
				dataService.getData('/ws/getAgentsByType',{type:type}).then(function(data){
					$scope.agents=data;
				blockUI.stop();
				});	
			}
			else
			{
				$scope.agents={};
			}
		},
		getDiscountAmount:function()
		{
			if($scope.objRec.discount_percent && $scope.objRec.total_amount) $scope.objRec.discount=($scope.objRec.discount_percent*$scope.objRec.total_amount)/100;
			else $scope.objRec.discount=0;
		},
		clearDistrib:function()
		{
			$scope.distObj={};
		}
	});


$scope.getFormData();
$scope.getInvoices();
});