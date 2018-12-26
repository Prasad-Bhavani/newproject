
'use strict';

var app = angular.module('invoiceApp',['ngRoute','blockUI','ngTable','ngDialog','inform','inform-exception','inform-http-exception','ui.bootstrap','ui.rCalendar','ngSanitize','ui.select']);

var FOLDER='/lyra/work/invoiceapp';
var FOLDER='/tdhinvoice';

var HOST=window.location.origin+FOLDER;

app.config(['$routeProvider',function($routeProvider, $locationProvider) {
    $routeProvider
  .when('/dashboard',{
    controller:'dashboardCtrl',
    templateUrl:'views/dashboard.html',
    activetab:'dashboard'
  })
  .when('/import_invoices',{
    controller:'importInvoicesCtrl',
    templateUrl:'views/import_invoices.html',
    activetab:'import_invoices'
  })
  .when('/beats',{
    controller:'beatCtrl',
    templateUrl:'views/beats.html',
    activetab:'beats'
  })
  .when('/agent',{
    controller:'agentCtrl',
    templateUrl:'views/agents.html',
    activetab:'agent'
  })
  .when('/distributors',{
    controller:'distributorCtrl',
    templateUrl:'views/distributors.html',
    activetab:'distributors'
  })
  .when('/users',{
    controller:'userCtrl',
    templateUrl:'views/users.html',
    activetab:'users'
  })
  .when('/invoices',{
    controller:'invoiceCtrl',
    templateUrl:'views/invoices.html',
    activetab:'invoices'
  })
  .when('/pending_invoices',{
    controller:'pendingInvoiceCtrl',
    templateUrl:'views/pending_invoices.html',
    activetab:'pending_invoices'
  })
  .when('/updateinvoices',{
    controller:'updateinvoiceCtrl',
    templateUrl:'views/updateinvoices.html',
    activetab:'updateinvoices'
  })
  .when('/printreports',{
    controller:'printreportsCtrl',
    templateUrl:'views/printreports.html',
    activetab:'printreports'
  })
  .when('/reports',{
    controller:'reportsCtrl',
    templateUrl:'views/reports.html',
    activetab:'reports'
  })
	.otherwise({
		redirectTo: '/dashboard'
	});

//$locationProvider.html5Mode(true);
}]).run(['$rootScope', '$location', function($rootScope, $location){
   var path = function() { return $location.path();};
   $rootScope.$watch(path, function(newVal, oldVal){
     $rootScope.activetab = newVal;
   });
}]);

app.controller('menuCtrl',function($scope, $route) {
    $scope.$route = $route;
});

app.directive('a', function(blockUI,$timeout) {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});

app.directive('input', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            elem.on('focus', function(e){
            $(this).attr('placeholder','');
        	elem.parent('div').addClass('focused');
            });
            elem.on('blur', function(e){
            if(elem.val()=='') elem.parent('div').removeClass('focused');
            if(elem.val()=='') if(attrs.placeholder!=undefined) $(this).attr('placeholder',attrs.placeholder);
            });
        }
   };
});

app.directive('select', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            $(this).on('focus', function(e){
            $(this).parent('div').addClass('focused');
            });
            $(this).on('blur', function(e){
            $(this).parent('div').removeClass('focused');
            });
        }
   };
});

app.directive('textarea', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            elem.on('focus', function(e){
        	elem.parent('div').addClass('focused');
            });
            elem.on('blur', function(e){
        	elem.parent('div').removeClass('focused');
            });
        }
   };
});

app.filter('format', function () {
  return function (item) {
      if(item){
           var t = item.split(/[- :]/);    
           var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
           var time=d.getTime();                 
           return time;
      }
  };
});

app.directive("ngFileSelect", function(fileReader, $timeout) {
  return {
    restrict:'E',
    replace:true,
    scope: {
      ngModel: '=',
      isImage:true
    },
    link: function($scope, el) {
      function getFile(file) {
        fileReader.readAsDataUrl(file, $scope)
          .then(function(result) {
            $timeout(function() {
              $scope.isImage = true;
              $scope.ngModel = result;
            });
          });
      }

      el.bind("change", function(e) {
        var file = (e.srcElement || e.target).files[0];
        getFile(file);
      });
    }
  };
});

app.filter('INR', function () {        
    return function (input) {
        if (!isNaN(input)) {
            var currencySymbol = 'Rs. ';
            //var output = Number(input).toLocaleString('en-IN');   <-- This method is not working fine in all browsers!   
            var result = input.toString().split('.');

            var lastThree = result[0].substring(result[0].length - 3);
            var otherNumbers = result[0].substring(0, result[0].length - 3);
            if (otherNumbers != '')
                lastThree = ',' + lastThree;
            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
            
            if (result.length > 1) {
                output += "." + result[1];
            }            

            return currencySymbol + output;
        }
    }
});

app.filter('arrayToString', function(){
  return function(arrName,opera)
  {
    var fee=[];
    var total=0;
    angular.forEach(arrName,function(v,k){
      total=total+parseInt(v);
      fee.push(v);
    });
    fee=fee.join(opera);
    data={'fee':fee,'total':total};
    return data;
  }
});

/*var _0xaca8=["\x67\x65\x74\x49\x6E\x64\x65\x78\x4F\x66\x43\x6F\x75\x6E\x74","\x6C\x65\x6E\x67\x74\x68","\x63\x6F\x75\x6E\x74","\x66\x69\x6C\x74\x65\x72","\x67\x65\x74\x42\x61\x74\x63\x68\x65\x73","\x67\x65\x74\x46\x75\x6C\x6C\x59\x65\x61\x72","\x6C\x6F\x67","\x2D","\x70\x75\x73\x68","\x67\x65\x74\x59\x65\x61\x72\x73\x62\x79\x42\x61\x74\x63\x68","\x49\x20\x59\x45\x41\x52","\x49\x49\x20\x59\x45\x41\x52","\x49\x49\x49\x20\x59\x45\x41\x52","\x49\x56\x20\x59\x45\x41\x52","\x56\x20\x59\x45\x41\x52","\x56\x49\x20\x59\x45\x41\x52","\x56\x49\x49\x49\x20\x59\x45\x41\x52","\x73\x70\x6C\x69\x74","\x67\x65\x74\x50\x75\x72\x73\x75\x69\x6E\x67\x59\x65\x61\x72","\x63\x68\x65\x63\x6B\x54\x65\x72\x6D\x44\x75\x65","\x67\x65\x74\x44\x61\x74\x65","\x67\x65\x74\x4D\x6F\x6E\x74\x68","\x20","\x74\x65\x72\x6D\x5F\x72\x61\x6E\x67\x65","\x61\x6D\x6F\x75\x6E\x74","\x66\x6F\x72\x45\x61\x63\x68","\x67\x65\x74\x44\x61\x79","\x73\x65\x74\x44\x61\x74\x65","\x49\x4E\x52","\u20B9","\x2E","\x73\x75\x62\x73\x74\x72\x69\x6E\x67","","\x2C","\x72\x65\x70\x6C\x61\x63\x65","\x67\x65\x74\x57\x6F\x72\x6B\x69\x6E\x67\x44\x61\x79\x73\x77\x69\x74\x68\x6F\x75\x74\x53\x75\x6E\x64\x61\x79\x73","\x67\x65\x74\x59\x65\x61\x72\x4E\x6F","\x56\x49\x49\x20\x59\x45\x41\x52","\x49\x58\x20\x59\x45\x41\x52","\x58\x20\x59\x45\x41\x52","\x69\x6E\x64\x65\x78\x4F\x66","\x63\x6F\x75\x72\x73\x65\x59\x65\x61\x72\x73","\x49","\x49\x49","\x49\x49\x49","\x49\x56","\x56","\x56\x49","\x56\x49\x49","\x56\x49\x49\x49","\x49\x58","\x58","\x69\x64","\x79\x65\x61\x72","\x20\x59\x65\x61\x72","\x61\x72\x72\x61\x79\x54\x6F\x53\x74\x72\x69\x6E\x67","\x6A\x6F\x69\x6E"];app[_0xaca8[3]](_0xaca8[0],function(){return function(_0x9916x1,_0x9916x2,_0x9916x3){var _0x9916x4=_0x9916x1[_0xaca8[1]],_0x9916x5=0;for(_0x9916x5= 0;_0x9916x5< _0x9916x4;_0x9916x5= _0x9916x5+ 1){if(_0x9916x1[_0x9916x5][_0x9916x3]== _0x9916x2){return _0x9916x1[_0x9916x5][_0xaca8[2]]}};return 0}});app[_0xaca8[3]](_0xaca8[4],function(){return function(_0x9916x6,_0x9916x7){var _0x9916x8=[];for(var _0x9916x9=0;_0x9916x9< _0x9916x7;_0x9916x9++){var _0x9916xa= new Date()[_0xaca8[5]]();console[_0xaca8[6]](_0x9916xa);_0x9916x8[_0xaca8[8]]((_0x9916xa+ _0x9916x9- 0)+ _0xaca8[7]+ ((_0x9916xa+ _0x9916x9- 0)+ (_0x9916x6- 0)))};return _0x9916x8}});app[_0xaca8[3]](_0xaca8[9],function(){return function(_0x9916xa){var _0x9916xb=[_0xaca8[10],_0xaca8[11],_0xaca8[12],_0xaca8[13],_0xaca8[14],_0xaca8[15],_0xaca8[16]];var _0x9916xc=[];var _0x9916x6=(_0x9916xa[_0xaca8[17]](_0xaca8[7])[1]- 0)- (_0x9916xa[_0xaca8[17]](_0xaca8[7])[0]- 0);for(var _0x9916x9=0;_0x9916x9< _0x9916x6;_0x9916x9++){_0x9916xc[_0xaca8[8]](_0x9916xb[_0x9916x9])};console[_0xaca8[6]](_0x9916xc);return _0x9916xc}});app[_0xaca8[3]](_0xaca8[18],function(){return function(_0x9916xa){var _0x9916xc=[_0xaca8[10],_0xaca8[11],_0xaca8[12],_0xaca8[13],_0xaca8[14],_0xaca8[15],_0xaca8[16]];var _0x9916xd= new Date()[_0xaca8[5]]();var _0x9916xe=(_0x9916xa[_0xaca8[17]](_0xaca8[7])[0]- 0);var _0x9916xf=(_0x9916xa[_0xaca8[17]](_0xaca8[7])[1]- 0);if(_0x9916xf> _0x9916xd){var _0x9916x10=_0x9916xd- _0x9916xe}else {var _0x9916x10=(_0x9916xf- _0x9916xe- 1)};var _0x9916x11=_0x9916xc[_0x9916x10];return _0x9916x11}});app[_0xaca8[3]](_0xaca8[19],function(){return function(_0x9916x12,_0x9916x13,_0x9916x14,_0x9916x15){var _0x9916x16= new Date()[_0xaca8[20]]();var _0x9916x17= new Date()[_0xaca8[21]]()+ 1;var _0x9916x18= new Date()[_0xaca8[5]]();var _0x9916x19= new Date(_0x9916x18+ _0xaca8[22]+ _0x9916x17+ _0xaca8[22]+ _0x9916x16);var _0x9916x1a=[7,8,9,10,11,12,1,2,3,4,5,6];var _0x9916x1b=0;var _0x9916x1c=0;var _0x9916x1d=0;var _0x9916x1e=0;var _0x9916x1f=0;var _0x9916x20=0;var _0x9916x21=_0x9916x14;angular[_0xaca8[25]](_0x9916x12,function(_0x9916x22,_0x9916x5){var _0x9916x23=_0x9916x22[_0xaca8[23]][_0xaca8[17]](_0xaca8[7]);var _0x9916x24=(_0x9916x23[1]- 0)- (_0x9916x23[0]- 0);for(var _0x9916x9=0;_0x9916x9<= _0x9916x24;_0x9916x9++){var _0x9916x25=_0x9916x1a[_0x9916x1f];var _0x9916x26= new Date(_0x9916x14+ _0xaca8[22]+ _0x9916x25+ _0xaca8[22]+ _0x9916x15);if(_0x9916x26<= _0x9916x19){_0x9916x1b= _0x9916x1b+ (_0x9916x22[_0xaca8[24]]/ 3);if((_0x9916x13< _0x9916x1b)&& _0x9916x20== 0){_0x9916x20= _0x9916x1a[_0x9916x9]}};_0x9916x1f= _0x9916x1f+ 1;if(_0x9916x25== 12){_0x9916x14= _0x9916x14+ 1}}});if(_0x9916x20< 7){_0x9916x21= _0x9916x21+ 1};var _0x9916x27=0;dueDate=  new Date(_0x9916x21+ _0xaca8[22]+ _0x9916x20+ _0xaca8[22]+ _0x9916x15);while(dueDate<= _0x9916x19){var _0x9916x28=dueDate[_0xaca8[26]]();if(!(_0x9916x28== 0)){_0x9916x27++};dueDate[_0xaca8[27]](dueDate[_0xaca8[20]]()+ 1)};if(_0x9916x1b> 0){_0x9916x1d= _0x9916x1b- _0x9916x13};if(_0x9916x27!= 0){_0x9916x27= _0x9916x27- 1};var _0x9916x29={"\x64\x61\x79\x73":_0x9916x27,"\x74\x65\x72\x6D\x5F\x64\x75\x65":_0x9916x1d};return _0x9916x29}});app[_0xaca8[3]](_0xaca8[28],function(){return function(_0x9916x2a){if(!isNaN(_0x9916x2a)){var _0x9916x2b=_0xaca8[29];var _0x9916x2c=_0x9916x2a.toString()[_0xaca8[17]](_0xaca8[30]);var _0x9916x2d=_0x9916x2c[0][_0xaca8[31]](_0x9916x2c[0][_0xaca8[1]]- 3);var _0x9916x2e=_0x9916x2c[0][_0xaca8[31]](0,_0x9916x2c[0][_0xaca8[1]]- 3);if(_0x9916x2e!= _0xaca8[32]){_0x9916x2d= _0xaca8[33]+ _0x9916x2d};var _0x9916x2f=_0x9916x2e[_0xaca8[34]](/\B(?=(\d{2})+(?!\d))/g,_0xaca8[33])+ _0x9916x2d;if(_0x9916x2c[_0xaca8[1]]> 1){_0x9916x2f+= _0xaca8[30]+ _0x9916x2c[1]};return _0x9916x2b+ _0x9916x2f}}});app[_0xaca8[3]](_0xaca8[35],function(){return function(_0x9916x30,_0x9916x19){console[_0xaca8[6]](_0x9916x30);var _0x9916x30=_0x9916x30[_0xaca8[17]](_0xaca8[7]);var _0x9916x19=_0x9916x19[_0xaca8[17]](_0xaca8[7]);_0x9916x30=  new Date(_0x9916x30[2]+ _0xaca8[22]+ _0x9916x30[0]+ _0xaca8[22]+ _0x9916x30[1]);_0x9916x19=  new Date(_0x9916x19[2]+ _0xaca8[22]+ _0x9916x19[0]+ _0xaca8[22]+ _0x9916x19[1]);var _0x9916x27=0;var _0x9916x31=_0x9916x30;while(_0x9916x31<= _0x9916x19){var _0x9916x28=_0x9916x31[_0xaca8[26]]();if(!(_0x9916x28== 0)){_0x9916x27++};_0x9916x31[_0xaca8[27]](_0x9916x31[_0xaca8[20]]()+ 1)};return _0x9916x27}});app[_0xaca8[3]](_0xaca8[36],function(){return function(_0x9916x32,_0x9916xa){var _0x9916x33=0;var _0x9916xc=[_0xaca8[10],_0xaca8[11],_0xaca8[12],_0xaca8[13],_0xaca8[14],_0xaca8[15],_0xaca8[37],_0xaca8[16],_0xaca8[38],_0xaca8[39]];var _0x9916x34=_0x9916xa[_0xaca8[17]](_0xaca8[7]);_0x9916x33= ((_0x9916x34[0]- 0)+ (_0x9916xc[_0xaca8[40]](_0x9916x32)- 0));return _0x9916x33}});app[_0xaca8[3]](_0xaca8[41],function(){return function(_0x9916x32,_0x9916x35){if(_0x9916x32){years= [];yr= [];romanno= [_0xaca8[42],_0xaca8[43],_0xaca8[44],_0xaca8[45],_0xaca8[46],_0xaca8[47],_0xaca8[48],_0xaca8[49],_0xaca8[50],_0xaca8[51]];for(var _0x9916x9=0;_0x9916x9< _0x9916x32;_0x9916x9++){yr[_0xaca8[52]]= _0x9916x9+ 1;yr[_0xaca8[53]]= romanno[_0x9916x9]+ _0xaca8[54];years[_0xaca8[8]](yr);yr= []};return years}}});app[_0xaca8[3]](_0xaca8[55],function(){return function(_0x9916x36,_0x9916x37){var _0x9916x38=[];var _0x9916x39=0;angular[_0xaca8[25]](_0x9916x36,function(_0x9916x22,_0x9916x5){_0x9916x39= _0x9916x39+ parseInt(_0x9916x22);_0x9916x38[_0xaca8[8]](_0x9916x22)});_0x9916x38= _0x9916x38[_0xaca8[56]](_0x9916x37);data= {"\x66\x65\x65":_0x9916x38,"\x74\x6F\x74\x61\x6C":_0x9916x39};return data}})*/

app.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        showClose: false,
        closeByDocument: false,
        closeByEscape: false
    });
}]);

app.constant('CONSTANTS',{
    '1':{'laminates':['Hot Laminate','Cold Laminate'],'gsms':['200','220','230','240','280','300'],'types':['Front Light','Back Light'],'feets':['3','4','5','6','8','10'],'lengthend':['70']},
    '2':{'gsms':['9H','10H'],'types':['Front Ligth','Back light'],'feets':['3','4','5','6','8','10'],'lengthend':['50']},
    '3':{'colors':['Red','Green','Blue','Yellow','White','Black']},
    '4':{'feets':['3','4','5'],'lengthend':['50']},
    '5':{'types':['Crystal','QPD'],'sizes':['6 Inches','8 Inches','10 Inches','12 Inches']},
    '6':{'types':['P1','P2','P3']},
    'pay_modes':['Cash','Credit','Cheque','Fund Transfer']
});

app.factory("fileReader", function($q, $log) {
  var onLoad = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.resolve(reader.result);
      });
    };
  };

  var onError = function(reader, deferred, scope) {
    return function() {
      scope.$apply(function() {
        deferred.reject(reader.result);
      });
    };
  };

  var onProgress = function(reader, scope) {
    return function(event) {
      scope.$broadcast("fileProgress", {
        total: event.total,
        loaded: event.loaded
      });
    };
  };

  var getReader = function(deferred, scope) {
    var reader = new FileReader();
    reader.onload = onLoad(reader, deferred, scope);
    reader.onerror = onError(reader, deferred, scope);
    reader.onprogress = onProgress(reader, scope);
    return reader;
  };

  var readAsDataURL = function(file, scope) {
    var deferred = $q.defer();

    var reader = getReader(deferred, scope);
    reader.readAsDataURL(file);

    return deferred.promise;
  };

  return {
    readAsDataUrl: readAsDataURL
  };
});

app.directive('exportTable', function(){
          var link = function ($scope, elm, attr) {
            console.log(elm);
            $scope.$on('export-pdf', function (e, d) {
                elm.tableExport({ type: 'pdf', escape: false });
            });
            $scope.$on('export-excel', function (e, d) {
                elm.tableExport({ type: 'excel', escape: false });
            });
            $scope.$on('export-doc', function (e, d) {
                elm.tableExport({ type: 'doc', escape: false });
            });
            $scope.$on('export-csv', function (e, d) {
                elm.tableExport({ type: 'csv', escape: false });
            });
        }
        return {
            restrict: 'C',
            link: link
        }
});

app.directive('accessibleForm', function () {
    return {
        restrict: 'A',
        link: function (scope, elem) {

            // set up event handler on the form element
            elem.on('submit', function () {

                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.ng-invalid');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });

            // set up event handler on the form element
            elem.on('reset', function () {

              angular.forEach(elem,function(k)
                {
                  $('input').blur();
                  $('.form-line').removeClass('focused');
                });

                // find the first invalid element
                var firstInvalid = elem[0].querySelector('.form-control');

                // if we find one, set focus
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
});

app.directive("datepicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elem, attrs, ngModelCtrl) {
      var updateModel = function (dateText) {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(dateText);
        });
      };
      var options = {
        dateFormat: "dd-M-yy",
        changeYear:true,
        changeMonth:true,
        timeFormat:"hhmm",
        onSelect: function (dateText) {
          updateModel(dateText);
        }
      };
      $(elem).datepicker(options);
    }
  }
});

angular.module('ui.rCalendar', ['ui.rCalendar.tpls'])
    .constant('calendarConfig', {
        formatDay: 'dd',
        formatDayHeader: 'EEE',
        formatDayTitle: 'MMMM dd, yyyy',
        formatWeekTitle: 'MMMM yyyy, Week w',
        formatMonthTitle: 'MMMM yyyy',
        formatWeekViewDayHeader: 'EEE d',
        formatHourColumn: 'ha',
        calendarMode: 'month',
        showWeeks: false,
        showEventDetail: true,
        startingDay: 0,
        allDayLabel: 'all day',
        noEventsLabel: 'No Events',
        eventSource: null,
        queryMode: 'local'
});

app.directive('printDiv', function () {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('click', function(evt){    
        evt.preventDefault();    
        PrintElem(attrs.printDiv);
      });

      function PrintElem(elem)
      {
        var content  = $(elem).html();
        PrintWithIframe(content);
      }

      function PrintWithIframe(data) 
      {
        $('iframe#printf').remove();
        if ($('iframe#printf').size() == 0) {
          $('html').append('<iframe id="printf" name="printf"></iframe>');  // an iFrame is added to the html content, then your div's contents are added to it and the iFrame's content is printed

          var mywindow = window.frames["printf"];
          mywindow.document.write('<!DOCTYPE html><html><head><title>Tenali Double Horse</title><style type="text/css">body {margin: 0px;padding: 0px;}.body{padding: 0px 25px;}.printheader{margin: 0px;padding: 1px;text-align: center;background-color: gray;color: white;}.printtable{margin: 5px;}p{margin: 5px;}.notopbottom{border-top: 0px;border-bottom: 0px;}.table{width:100%;}td,th{padding:4px;}.noprint{display:none}.print{display:block}body{font-size:12px;}</style></head><body><h3 align="center">Tenali Double Horse</h3>'
            + data +
            '</body></html>');
          console.log(mywindow.document);
          $(mywindow.document).ready(function(){
            mywindow.print();
            setTimeout(function(){
              $('iframe#printf').remove();
            },
            2000);  // The iFrame is removed 2 seconds after print() is executed, which is enough for me, but you can play around with the value
          });
        }

        return true;
      }
    }
  };
});

app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);

      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
});
