app.controller('updateinvoiceCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS,$timeout)
{
	angular.extend($scope,{
		obj:{},
		submitted:false,
		searchSubmit:false,
		cboys:{},
		invoices:0
	});

	angular.extend($scope,{
		subForm:function(formStatus)
		{
			$scope.submitted=true;
			if(formStatus)
			{
				blockUI.start("Please wait...");
				$scope.obj.recs=$scope.invoices;
				dataService.getData('/ws/saveAgentInvoicesList',$scope.obj).then(function(response){
					inform.add("Successfully Saved",{type:'success'});
					$scope.cancelSearch();
					$scope.getCBoyswithInvoicesCount();
					blockUI.stop();
				});
			}			
		},
		searchInvoiceForm:function(formStatus)
		{
			$scope.searchSubmit=true;
			if(formStatus)
			{
				dataService.getData('/ws/getAgentInvoicesPendingbyDate',$scope.obj).then(function(response){
					$scope.invoices=response;
				});	
			}
		},
		getCBoyswithInvoicesCount:function()
		{
			dataService.getData('/ws/getCBoyswithInvoicesCount',{agent:"browser"}).then(function(response){
				$scope.cboys=response;
			});
		},
		cancelSearch:function()
		{
			$scope.obj={};
			$scope.submitted=false;
			$scope.searchSubmit=false;
			$scope.invoices=0;
		}
	});

$scope.getCBoyswithInvoicesCount();
});