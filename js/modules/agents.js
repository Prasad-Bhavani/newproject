app.controller('agentCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS)
{
	angular.extend($scope,{
		obj:{},
		agent:{},
		towns:{},
		isAgents:true,
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
				dataService.getData('/ws/addAgent',$scope.obj).then(function(response){
					if(response==1)
					{
						inform.add(MSG,{type:'success'});
						$scope.getAgents();
					}
					else $scope.obj.isExist=true;
				blockUI.stop();
				});
			}
		},
		getAgents:function()
		{
			$scope.obj={};
			$scope.submitted=false;
			dataService.getData('/ws/getAgents',{agent:"browser"}).then(function(response){
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
			$scope.isAgents=true;
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
		   		dataService.getData('/ws/changeAgentStatus',{id:id,status:status}).then(function(recs){
				inform.add('Agent Status Successfully updated', { type: 'success' });
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
		getAgent:function(id)
		{
			blockUI.start('Loading...');
			dataService.getData('/ws/getAgent',{id:id}).then(function(data){
				$scope.obj=data;
				$scope.isAgents=false;
			blockUI.stop();
			});
		},
		addAgent:function()
		{
			$scope.resetForm();
			$scope.isAgents=false;
		},
		resetForm:function()
		{
			$scope.submitted=false;
			$scope.obj={};
		}
	});

$scope.getAgents();
});