 app.controller('assignInvoiceCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS,$timeout)
{
	angular.extend($scope,{
		obj:{},
		retailer:{},
		towns:{},
		isRetailers:true,
		searchSubmitted:false,
		submitted:false,
		isExist:false,
		searchObj:{},
		selected:{},
		assignSubmitted:false,
		assignObj:{},
		invoiceRecs:0,
		objRecs:[],
		objsubmit:false,
		objRec:{},
		editObj:{},
		editSubmitted:false
	});

	angular.extend($scope,{
		searchForm:function(formStatus)
		{
			$scope.searchSubmitted=true;
			console.log($scope.searchObj);
			if(formStatus)
			{
				$scope.searchObj.agent="browser";
				blockUI.start('Loading...');
				dataService.getData('/ws/getInvoicesbyBeat',$scope.searchObj).then(function(data){
					$scope.invoiceRecs=data;
				blockUI.stop();
				});
			}
		},
		getBeats:function()
		{
			blockUI.start('Loading...');
			dataService.getData('/ws/getBeats',{agent:"browser"}).then(function(data){
				$scope.beats=data;
			blockUI.stop();
			});
		},
		getCBoys:function()
		{
			blockUI.start('Loading...');
			dataService.getData('/ws/getCBoys',{agent:"browser"}).then(function(data){
				$scope.cboys=data;
			blockUI.stop();
			});
		},
		addRetailer:function()
		{
			$scope.resetForm();
			$scope.isRetailers=false;
		},
		cancelSearch:function()
		{
			$scope.searchSubmitted=false;
			$scope.searchObj={};
		},
		resetForm:function()
		{
			$scope.searchSubmitted=false;
			$scope.searchObj={};
		},
		getInvoiceids:function()
		{
			selectedInvoiceIds=[];
			$scope.assignObj.isCheck=false;
			angular.forEach($scope.selected.invoices, function(val,key){
				if(val==true) selectedInvoiceIds.push(key);
			});
			console.log(selectedInvoiceIds);
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
					blockUI.stop();
				});				
			}
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
		}
	});

$scope.getBeats();
$scope.getCBoys();
});