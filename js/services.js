app.service('dataService', function($http,ngDialog,$timeout) {
   this.getData = function(serv,obj,$scope) {	   
	   obj.agent="browser";
	   return $http({
			  method: "post",
			  url: HOST+serv,
			  data:obj,
			  contentType:false,
			  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		})
		.then(function successCallback(data) {
		if(data.data==104)
		{
			ngDialog.open({
				            template:'views/template/session_expired.html',
				            className: 'ngdialog-theme-default',
				            scope:$scope
				    }).closePromise.then(function(){
				    		window.location='index'+window.location.hash;
			});
		}
		else return data.data;
		},function errorCallback(data){         	
         	return data;
        });
   }
});