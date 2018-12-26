app.controller('userCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS,$timeout)
{
	angular.extend($scope,{
		obj:{},
		user:{},
		towns:{},
		isUsers:true,
		submitted:false,
		isExist:false,
		isConfirm:false,
		otpObj:{}
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
				dataService.getData('/ws/addUser',$scope.obj).then(function(response){
					if(response==1)
					{
						inform.add(MSG,{type:'success'});
						$scope.getUsers();
					}
					else $scope.obj.isExist=true;
				blockUI.stop();
				});
			}
		},
		getUsers:function()
		{
			$scope.obj={};
			$scope.submitted=false;
			dataService.getData('/ws/getUsers',{user:"browser"}).then(function(response){
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
			$scope.isUsers=true;
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
		   		dataService.getData('/ws/changeUserStatus',{id:id,status:status}).then(function(data){
		   		if(data.status=='otp')
		   		{
		   			$scope.otpObj={};
		   			$scope.isConfirm=false;
		   			$scope.otpObj.id=id;
		   			ngDialog.openConfirm({
				    template:'views/template/otp.html',
			        className: 'ngdialog-theme-default',
			        scope:$scope,
			        closeByEscape:true
				   	}).then(function(){
				   	}).catch(function(){
				   	});
		   		}
		   		else
		   		{
		   			recs=data.recs;
					inform.add('User Status Successfully updated', { type: 'success' });
					if(recs!=0)
					{
						angular.forEach(recs,function(val,key){
							recs[key].sno=key+1;
						});
						$scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: recs});
					}
					else $scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: ''});	
		   		}
				blockUI.stop();
		   		});
		   	}).catch(function(){
		   	});
		},
		subOtpForm:function(formStatus)
		{
			$scope.isConfirm=true;
			if(formStatus)
			{
				$scope.otpObj.otpError=false;
				blockUI.start('Please wait...');
				dataService.getData('/ws/verifyOtp',$scope.otpObj).then(function(data){
					if(data==1)
					{
						$scope.alertMsg="Successfully account activated";
						ngDialog.open({
			            template:'views/template/alert.html',
			            className: 'ngdialog-theme-default',
			            scope:$scope
					    }).closePromise.then(function(){
					    	$timeout(function(){$('.modal-close').trigger('click');},0);
					    	$scope.getUsers();
						});
					}
					else $scope.otpObj.otpError=true;
				blockUI.stop();
				});	
			}
		},
		getUser:function(id)
		{
			blockUI.start('Loading...');
			dataService.getData('/ws/getUser',{id:id}).then(function(data){
				$scope.obj=data;
				$scope.isUsers=false;
			blockUI.stop();
			});
		},
		addUser:function()
		{
			$scope.resetForm();
			$scope.isUsers=false;
		},
		resetForm:function()
		{
			$scope.submitted=false;
			$scope.obj={};
		}
	});

$scope.getUsers();
});