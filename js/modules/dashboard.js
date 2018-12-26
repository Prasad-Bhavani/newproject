app.controller('dashboardCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS)
{
	angular.extend($scope,{
		obj:{},
		days:{},
		isRecs:false,
		submitted:false,
		recs:{},
		customers:{},
		selected:{},
		sendObj:{},
		selectedInvoiceIds:[],
		sendRecs:{},
		isInvoices:false
	});

	angular.extend($scope,{
		getDashboardList:function()
		{
			blockUI.start('Please wait...');
			dataService.getData('/ws/getDashboardList',{agent:"browser"}).then(function(response){
				var recs=response;
				$scope.invoices=response;
				if(recs!=0)
				{
					angular.forEach(recs, function(v,k){
						recs[k].sno=k+1;
					});
					$scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: recs});
				}
				else $scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: ''});
			blockUI.stop();
			});
		},
		getInvoiceListByDistributor:function(distributor)
		{
			$scope.distributor_id=distributor.distributor_id;
			blockUI.start('Please wait...');
			dataService.getData('/ws/getInvoiceListByDistributor',{distributor_id:$scope.distributor_id}).then(function(response){
				var recs=response;
				$scope.invoices=response;
				$scope.disRec=distributor;
				$scope.isInvoices=true;
			blockUI.stop();
			});
		},
		getClose:function()
		{
			$scope.isInvoices=false;
		},
		getInvoiceids:function()
		{
			selectedInvoiceIds=[];
			$scope.sendObj.isCheck=false;
			angular.forEach($scope.selected.invoices, function(val,key){
				if(val==true) selectedInvoiceIds.push(key);
			});
			if(selectedInvoiceIds.length!=0) $scope.assign=true; else $scope.assign=false;
			if(selectedInvoiceIds.length==$scope.invoices.length) $scope.sendObj.isCheck=true;
			$scope.sendRecs=selectedInvoiceIds;
		},
		checkAll:function()
		{
			if($scope.sendObj.isCheck)
			{
				selectedInvoiceIds=[];
				$scope.selected.invoices=[];
				angular.forEach($scope.invoices, function(val,key){
					$scope.selected.invoices[val.id]=true;
					selectedInvoiceIds.push(val.id);
				});
				if(selectedInvoiceIds.length!=0) $scope.assign=true; else $scope.assign=false;
				$scope.sendRecs=selectedInvoiceIds;
			}
			else
			{
				selectedInvoiceIds=[];
				$scope.selected.invoices=[];
				if(selectedInvoiceIds.length!=0) $scope.assign=true; else $scope.assign=false;
				$scope.sendRecs=selectedInvoiceIds;
			}
		},
		cancelCheck:function()
		{
			selectedInvoiceIds=[];
			$scope.selected.invoices={};
			$scope.sendObj={};
			$scope.sendRecs=selectedInvoiceIds;
		},
		sendSms:function()
		{
			$scope.sendRecsList=[];
			$scope.sendRec={};
			if($scope.sendRecs.length>0)
			{
				blockUI.start('Please wait...');
				angular.forEach($scope.sendRecs, function(id){
					$scope.sendRec={};
					$scope.sendRec.id=id;
					$scope.sendRec.distributor_name=$.grep($scope.invoices, function(v){
							return id==v.id;
						})[0].distributor_name;
					$scope.sendRec.contact_no=$.grep($scope.invoices, function(v){
								return id==v.id;
							})[0].contact_no;
					$scope.sendRec.due_amount=$.grep($scope.invoices, function(v){
								return id==v.id;
							})[0].due_amount;
					$scope.sendRec.due_amount=$filter('INR')($scope.sendRec.due_amount);
					$scope.sendRecsList.push($scope.sendRec);
				});
				dataService.getData('/ws/sendSms',{recs:$scope.sendRecsList}).then(function(response){
					$scope.alertMsg="Messages sent successfully";
					ngDialog.open({
			            template:'views/template/alert.html',
			            className: 'ngdialog-theme-default',
			            scope:$scope
				    }).closePromise.then(function(){
				    	window.location.href='?';
					});
					blockUI.stop();
				});
			}
			else
			{
				$scope.alertMsg="Select atleast one distributor";
				ngDialog.open({
		            template:'views/template/alert.html',
		            className: 'ngdialog-theme-default',
		            scope:$scope
			    }).closePromise.then(function(){
				});
			}
		}
	});
$scope.getDashboardList();
});