app.controller('pendingInvoiceCtrl', function($scope,$http,blockUI,dataService,ngDialog,NgTableParams,inform,$window,$filter,CONSTANTS,$timeout)
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
		searchObj:{}
	});

	angular.extend($scope,{
		getInvoicesList:function()
		{
			blockUI.start('Please wait...');
			dataService.getData('/ws/getPendingInvoicesList',{agent:"browser"}).then(function(response){
				var recs=response;
				$scope.invoices=response;
				if($scope.invoices==0) $scope.invoices={};
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
				$scope.alertMsg='Are you sure you want to Send SMS';
				ngDialog.openConfirm({
				    template:'views/template/confirm.html',
			        className: 'ngdialog-theme-default',
			        scope:$scope,
			        closeByEscape:true
			   	}).then(function(){
					blockUI.start('Please wait...');
					angular.forEach($scope.sendRecs, function(id){
						$scope.sendRec={};
						$scope.sendRec.id=id;
						$scope.sendRec.balance_amount=$.grep($scope.invoices, function(v){
								return id==v.id;
							})[0].balance_amount;
						$scope.sendRec.distributor_name=$.grep($scope.invoices, function(v){
								return id==v.id;
							})[0].distributor_name;
						$scope.sendRec.distributor_id=$.grep($scope.invoices, function(v){
								return id==v.id;
							})[0].distributor_id;
						$scope.sendRec.contact_no=$.grep($scope.invoices, function(v){
									return id==v.id;
								})[0].contact_no;
						$scope.sendRec.invoice_number=$.grep($scope.invoices, function(v){
									return id==v.id;
								})[0].invoice_number;
						$scope.sendRec.balance_amount=$filter('INR')($scope.sendRec.balance_amount);
						$scope.sendRecsList.push($scope.sendRec);
					});
					dataService.getData('/ws/sendSms',{recs:$scope.sendRecsList}).then(function(response){
						$scope.alertMsg="Messages sent successfully";
						ngDialog.open({
				            template:'views/template/alert.html',
				            className: 'ngdialog-theme-default',
				            scope:$scope
					    }).closePromise.then(function(){
					    	$scope.sendRec={};
					    	$scope.sendRecs=[];
				            $scope.sendRecsList=[];
	            			selectedInvoiceIds=[];
	            			$scope.selected.invoices={};
	            			$scope.sendObj={};
	            			$scope.sendRecs=selectedInvoiceIds;
						});
						blockUI.stop();
					});
				}).catch(function(){
		   		});
			}
			else
			{
				$scope.alertMsg="Select atleast one invoice";
				ngDialog.open({
		            template:'views/template/alert.html',
		            className: 'ngdialog-theme-default',
		            scope:$scope
			    }).closePromise.then(function(){
				});
			}
		},
		searchForm:function(formStatus)
		{
			$scope.searchSubmitted=true;
			console.log($scope.searchObj);
			if(formStatus)
			{
				$scope.searchObj.agent="browser";
				blockUI.start('Loading...');
				dataService.getData('/ws/getInvoicesListByDate',$scope.searchObj).then(function(data){
					$scope.invoices=data;
					if($scope.invoices==0) $scope.invoices={};
					if(data!=0)
					{
						angular.forEach(data, function(v,k){
							data[k].sno=k+1;
						});
						$scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: data});
					}
					else $scope.tableParams = new NgTableParams({page: 1, count: 10}, {data: ''});
				blockUI.stop();
				});
			}
		},
		cancelSearch:function()
		{
			$scope.searchSubmitted=false;
			$scope.searchObj={};
			$scope.getInvoicesList();
		},
		exportAs:function (option) {
          switch (option) {
              case 'pdf': $scope.$broadcast('export-pdf', {}); 
                  break; 
              case 'excel': $scope.$broadcast('export-excel', {});
                  break; 
              case 'doc': $scope.$broadcast('export-doc', {});
                  break;
              case 'csv': $scope.$broadcast('export-csv', {});
                  break;
              default: console.log('no event caught'); 
          }
      }
	});
$scope.getInvoicesList();
});