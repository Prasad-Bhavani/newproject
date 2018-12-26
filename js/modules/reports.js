app.controller('reportsCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS)
{
	angular.extend($scope,{
		obj:{},
		recs:{},
		towns:{},
		isReports:true,
		submitted:false,
		isExist:false,
		recs:0,
		isCboys:true,
		isInvoices:false,
		isRetailers:false,
		isBeats:false,
		total_amount:'',
		invoiceObj:{},
		invoiceRecs:{},
		invoiceSubmitted:false
	});

	angular.extend($scope,{
		subForm:function(formStatus)
		{
			$scope.submitted=true;
			if(formStatus)
			{
				blockUI.start('Please wait...');
				$scope.obj.cboy_name=$.grep($scope.cboys, function(v){
							return $scope.obj.cboy_id==v.id;
						})[0].cboy_name;
				$scope.obj.contact_no=$.grep($scope.cboys, function(v){
							return $scope.obj.cboy_id==v.id;
						})[0].contact_no;
				dataService.getData('/ws/getCboysCollectedInvoicesList',$scope.obj).then(function(response){
					$scope.recs=response.recs;
					$scope.total_amount=(response.amount-0);
				blockUI.stop();
				});
			}
		},
		getCboys:function(formStatus)
		{
			dataService.getData('/ws/getCBoys',{"agent":'browser'}).then(function(response){
				$scope.cboys=response;
			});
		},
		resetForm:function()
		{
			$scope.submitted=false;
			$scope.obj={};
			$scope.recs=0;
			$scope.total_amount='';
		},
		getInvoicesPage:function()
		{
			$scope.isInvoices=true;
			$scope.isCboys=false;
		},
		getCboysPage:function()
		{
			$scope.isInvoices=false;
			$scope.isCboys=true;
		},
		subInvoiceForm:function()
		{
			$scope.invoiceSubmitted=true;
		}
	});

$scope.getCboys();
});