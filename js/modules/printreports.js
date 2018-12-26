app.controller('printreportsCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS)
{
	angular.extend($scope,{
		obj:{},
		recs:{},
		towns:{},
		isReports:true,
		submitted:false,
		isExist:false,
		recs:0
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
				dataService.getData('/ws/getAgentInvoicesforPrint',$scope.obj).then(function(response){
					$scope.recs=response;
				blockUI.stop();
				});
			}
		},
		getCBoyswithInvoicesCount:function(formStatus)
		{
			dataService.getData('/ws/getCBoyswithInvoicesCount',{"agent":'browser'}).then(function(response){
				$scope.cboys=response;
			});
		},
		resetForm:function()
		{
			$scope.submitted=false;
			$scope.obj={};
			$scope.recs=0;
		}
	});

$scope.getCBoyswithInvoicesCount();
});