app.controller('distributorCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS)
{
	angular.extend($scope,{
		obj:{},
		distributor:{},
		towns:{},
		isDistributors:true,
		submitted:false,
		isExist:false
	});

	angular.extend($scope,{
		subForm:function(formStatus)
		{
			if($scope.obj.id) MSG='Successfully Updated'; else MSG='Successfully Created';
			$scope.obj.isExist=false;
			$scope.submitted=true;
			if(formStatus)
			{
				blockUI.start('Please wait...');
				dataService.getData('/ws/addDistributor',$scope.obj).then(function(response){
					if(response==1)
					{
						inform.add(MSG,{type:'success'});
						$scope.getDistributors();
					}
					else $scope.obj.isExist=true;
				blockUI.stop();
				});
			}
		},
		getDistributors:function()
		{
			$scope.obj={};
			$scope.submitted=false;
			dataService.getData('/ws/getDistributors',{agent:"browser"}).then(function(response){
				recs=response;
			//	inform.add('Data received from server', { type: 'success' });
				if(recs!=0)
				{
					angular.forEach(recs,function(val,key){
						recs[key].sno=key+1;
					});
					$scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: recs});
				}
				else $scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: ''});
			});
			$scope.isDistributors=true;
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
		   		dataService.getData('/ws/changeDistributorStatus',{id:id,status:status}).then(function(recs){
				inform.add('Distributor Status Successfully updated', { type: 'success' });
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
		getDistributor:function(id)
		{
			blockUI.start('Loading...');
			dataService.getData('/ws/getDistributor',{id:id}).then(function(data){
				$scope.obj=data;
				$scope.isDistributors=false;
			blockUI.stop();
			});
		},
		addDistributor:function()
		{
			$scope.resetForm();
			$scope.isDistributors=false;
		},
		resetForm:function()
		{
			$scope.submitted=false;
			$scope.obj={};
		}
	});

$scope.getDistributors();
});