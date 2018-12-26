<?php
include_once('db/config.php');
include_once('session.php');
?>
<!DOCTYPE html>
<html ng-app="invoiceApp">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    
    <title><?php echo TABTITLE;  ?></title>
    <!-- Favicon-->
    <link rel="icon" href="images/icon.png" type="image/x-icon">

    <!-- Google Fonts -->
    <link href="css/icon.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="css/styles.css">
    <!-- Bootstrap Core Css -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Animation Css -->
    <link href="css/animate.min.css" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="css/waves.min.css" rel="stylesheet">

    <!-- Custom Css -->
    <link href="css/style.css" rel="stylesheet">

    <!-- Custom Css -->
    <link href="css/bootstrap-select.min.css" rel="stylesheet">

    <link href="css/all-themes.min.css" rel="stylesheet" />

    <link type="text/css" href="css/angular-block-ui.min.css" rel="stylesheet">
    <link type="text/css" href="css/ng-table.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/ngdialog/ngDialog.css">
    <link rel="stylesheet" href="css/ngdialog/ngDialog-theme-default.css">
    <link rel="stylesheet" href="css/angular-inform.min.css">
    <link rel="stylesheet" href="datepicker/jquery-ui.css">
    <link rel="stylesheet" href="css/calendar.min.css"/>
    <link rel="stylesheet" href="css/font-awesome.css"/>

    <script src="js/jquery.min.js"></script>
    <script src="js/angular.min.js"></script>
    <script src="js/angular-route.js"></script>
    <!-- Jquery Core Js -->
    <script src="js/ui-bootstrap-tpls-2.2.0.min.js"></script>
    <script src="js/tableExport.js"></script>
    <script src="js/app/jquery.base64.js"></script>
    <script src="js/app/sprintf.js"></script>
    <script src="js/app/jspdf.js"></script>
    <script src="js/app/base64.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/2.3.5/jspdf.plugin.autotable.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.0/angular-sanitize.js"></script>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/select2/3.4.5/select2.css">    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.8.5/css/selectize.default.css">

    <script src="js/select.js"></script>
    <link rel="stylesheet" href="css/select.css">
    <script src="js/app.js"></script>
    <script type="text/javascript" src="js/angular-block-ui.min.js"></script>
    <script type="text/javascript" src="js/ngDialog.min.js"></script>
    <script type="text/javascript" src="datepicker/jquery-ui.js"></script>
    <script type="text/javascript"  src="js/calendar-tpls.js"></script>
    <script src="js/services.js"></script>
    <script src="js/alertService.js"></script>
    <script type="text/javascript" src="js/ng-table.min.js"></script>
    <script src="js/angular-inform.min.js"></script>

    <script src="js/modules/dashboard.js"></script>
    <script src="js/modules/users.js"></script>
    <script src="js/modules/distributors.js"></script>
    <script src="js/modules/agents.js"></script>
    <script src="js/modules/pending_invoices.js"></script>
    <script src="js/modules/import_invoices.js"></script>
    <script src="js/modules/invoices.js"></script>
<style type="text/css">
.btnsmall
{
    padding: 1px 12px;
}
.ng-table th
{
    background-color: #e9e9e9;
}
.input-error
{
    border: 1px solid red !important;
}
.protd
{
    border-bottom: 2px solid orange;
}
.ui-select-container
{
    height: auto !important;
    padding: 0px !important;
    border: 0px solid white;
    min-width: 150px !important;
    max-width: 150px !important;
}
.select2-result-label:hover
{
    background-color: #3875d7 !important;
}
.badge {
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    -ms-border-radius: 2px;
    border-radius: 2px;
    padding: 10px;
    margin-top: -5px;
}
input,textarea
{
    text-transform: uppercase !important;
}
#printf
{
    display: none;
}
.theme-red .sidebar .menu .list li.active
{
    background-color: #00b0e4 !important;
}
.clred
{
    color: red;
    float: right;
    margin-top: -20px;
    margin-right: -20px;
}
.inprint
{
    display: none;
}
.ngdialog.ngdialog-theme-default.custom-width-900 .ngdialog-content {
    margin-top: -100px;
    padding: 0px;
    min-width: 900px;
}
.TABTH th
{
    text-align: center !important;
}
.yearcss
{
    padding: 15px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    min-height: 98px;
    margin: 15px 0px;
}
.normal
{
    font-weight: normal !important;
}
.yearcss:hover
{
    background-color: #ededed;
}
.absentcss
{
    background-color: red !important;
}
.sundaycss
{
    background-color: gray !important;
    color: white !important;
}
.paidcss
{
    background-color: #1f91f3 !important;
    color: white;
    padding: 8px;
    text-align: center;
}
.MARRHT5
{
    margin-right: 5px;
}
.fa
{
    cursor: pointer;
}
.MARTOP8
{
    margin-top: 8px;
}
.monthscss
{
    padding: 15px;
    background-color: #fff;
    cursor: pointer;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    min-height: 98px;
    margin: 15px 0px;
}
.monthscss:hover
{
    background-color: #ededed;
}
.monthTitle
{
    background-color: #fff;
    text-align: center;
}
.fade-element-in.ng-enter {
  transition: 0.1s linear all;
  opacity: 0;
}

.fade-element-in-init .fade-element-in.ng-enter {
  opacity: 1;
}

.fade-element-in.ng-enter.ng-enter-active {
  opacity: 1;
}
.tab8 td, .tab8 th
{
    padding: 8px;
}
.fade-element-in.ng-leave {
  transition: 0.1s linear all;
  opacity: 1;
}
.fade-element-in.ng-leave.ng-leave-active {
  opacity: 0;
}
.tableview
{
    margin: 25px;
    margin-top: 10px;
}
.tableview td
{
    padding: 5px;
}
.trbottomborder
{
    border-bottom: 2.5px solid #5db2ff !important;
    font-size: 19px;
    font-weight: bold;
}
.trbottomborder td
{
    padding-top: 25px;
}
.PADTOP10
{
    padding-top: 20px !important;
}
.material-icons
{
    cursor: pointer;
}
.assignbox h4 {
    background-color: #00616b;
    padding: 5px;
    margin: 0px;
    color: white;
}
.duecss
{
    font-weight: bold;
}
.input-filter
{
    border-radius: 0px;
}
.primary
{
    color: #1f91f3;
}
@media (min-width: 768px) {
.navbar-right {
    float: right!important;
    margin-right: 0px; 
}}
.assignbox {
    border: 1px solid #00616b;
    padding: 0px;
    margin: 0px;
}
.btn-info:hover, .btn-info:focus, .btn-info.focus, .btn-info:active, .btn-info.active, .open>.dropdown-toggle.btn-info {
    color: #fff !important;
    background-color: #31b0d5 !important;
    border-color: #269abc !important;
}
.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    display: none;
    float: left;
    min-width: 115px;
    padding: 0px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    -webkit-background-clip: padding-box;
    background-clip: padding-box;
    border: 1px solid #ccc;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 4px;
    -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
    box-shadow: 0 6px 12px rgba(0,0,0,.175);
}
.datetime-picker-dropdown > li.date-picker-menu div > table .btn-default {
    border: 0;
}
.btn-primary.active
{
    background-color: #286090 !important;
    border-color: #204d74 !important;
}
.ng-table-settings
{
    padding-bottom: 10px;
}
.hidemenu
{
    display: hide;
}
.dispnone
{
    display: none;
}
.checkcss, .radiocss
{
    margin-top: 8px;
}

label
{
    margin-bottom: 0px;
}

.form-control:focus + .form-inline
{
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    border:1px solid red;
}
.form-group .labelrt
{
    text-align: right;
    margin-top: 10px;
}
.form-group
{
    margin-bottom: 50px !important;
}
.haserror
{
    font-size: 11px;
    color: red;
    position: absolute;
}
.existserror
{
    margin-top: 10px;
    font-size: 11px;
    color: red;
}
.theme-red .nav>li>a:hover {
    color: #e3f023;
}
.table-head
{
    background-color: #00b0e4 !important;
    color: black !important;
}
.navbar-brand {
    padding:0px 15px;
}
.haserrorinputerror
{
    position: absolute;
    font-size: 11px;
    text-align: center;
    color: #fff;
    margin-top: 10px;
    top: -25px !important;
    right: 3px;
    text-align: right !important;
    background: url(images/validation-error-bg.png) center center no-repeat;
    padding: 3px 10px 10px 10px;
    line-height: 15px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    overflow: hidden;
    z-index: 9;
}
.fontbold
{
    font-weight: bold;
}
.MB10
{
    margin-bottom: 50px;
}
.MT50
{
    margin-top: 50px;
}
.MTB5
{
    margin-top: 5px;
    margin-bottom: 5px;
}
.MT10
{
    margin-top: 10px;
}
.TABPAD8 td,th
{
    padding: 8px;
}
.navbar-default .navbar-toggle{
    border: none;
}
.navbar .navbar-toggle:before {
    content: none;
}
@media screen and (max-width:480px)
{       
    .form-group
    {
        margin-bottom: 20px !important;
    }
}
legend
{
    background-color: #00b2c9;
    color: white;
    font-weight: bold;
    padding-left: 20px;
    padding-top: 10px;
}
  .imagePreview {
    width: 200px;
    height: 240px;
    border: 1px solid gray;
    background-position: center center;
    background-size: cover;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: inline-block;
    text-align: center;
}
 .haserror {
        position: absolute;
    }
 .form-group{
        margin-bottom: 25px;
    }
.menu .fa
{
    margin-top: 7px !important;
}
@media (max-width: 767px) {
.navbar .nav > li {
    display: block;
    width: 90%;
}
}
.navbar .navbar-toggle {
margin-top:6px;}
.navbar-default .navbar-toggle .icon-bar {
    background-color: #fff;
    
}
.navbar-default .navbar-toggle:focus, .navbar-default .navbar-toggle:hover {
    background-color:none !important;
}
@media only screen and (max-width: 640px) and (min-width: 360px)  {
.card {
    margin-top: 2px !important;
    }
    .table-head {
        height: 70px;
    }
    
}
.upl {
    padding-top:10px;
    text-align: right;
}
.table-responsive {
    border: 1px solid #e9e9e9;
    
}
body.block-ui {
    position: static;
    /* background: burlywood; */
    background: url('images/vector.jpg');
    background-size: 40% ;


}
</style>
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
</head>

<body class="theme-red ng-cloak">
<header>
  <div class="container">
    <div inform class="inform-fixed inform-shadow inform-animate"></div>
    <div data-navbar></div>
  </div>
</header>
<!-- Page Loader -->
<!--     <div class="page-loader-wrapper">
        <div class="loader">
            <div class="preloader">
                <div class="spinner-layer pl-red">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
            <p>Please wait Still Loading...</p>
        </div>
    </div> -->
<!-- Page Loader -->
<?php if(isset($_SESSION['msg']) && !empty($_SESSION['msg'])) {?>
    <div class="alert alert-<?php echo $_SESSION['cls']; ?> alert-dismissable msgcss">
  <a class="close" data-dismiss="alert" aria-label="close">&times;</a>
  <?php echo $_SESSION['msg']; ?>
</div>
<?php unset($_SESSION['msg']); unset($_SESSION['cls']); } ?>
    <!-- #END# Page Loader -->
    <!-- Overlay For Sidebars -->
    <div class="overlay"></div>
    <!-- #END# Overlay For Sidebars -->
    <!-- Top Bar -->
    <!-- <nav class="navbar" style="background: #e9e9e9">
        <div style="" class="container-fluid">
            <div style="margin-top: -4px;" class="navbar-header">
                <a href="javascript:void(0);" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false"></a>
                <a href="javascript:void(0);" class="bars" style="display: block;"></a>
                <a class="navbar-brand" style="padding: 0px" href="#!dashboard"><img style="display: inline-block;" src="images/logo.png" class="img-responsive" /></a>
                <a href="#" id="menubtn" style="margin-top: 10px; color: #00616b"><i class="material-icons">menu</i></a>
            </div>
            <div class="collapse navbar-collapse" id="navbar-collapse">
                <ul class="nav navbar-nav navbar-right">

                    <li class="pull-right"><a href="#" onclick="javascript:window.location.href='index?action=logout'" title="Logout"><button class="btn btn-default">Logout</button></a></li>
                </ul>
            </div>
        </div>
    </nav> -->
     <nav id="myNavbar" class="navbar navbar-default" role="navigation">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><img style="display: inline-block;" src="images/logo1.png" class="img-responsive" /></a>
            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav" ng-controller="menuCtrl">
                    
                    <li ng-class="{active: $route.current.activetab=='dashboard'}">
                        <a href="#!dashboard">
                            <i class="fa fa-dashboard" style=" vertical-align: middle;"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li ng-class="{active: $route.current.activetab=='users'}">
                        <a href="#!users">
                            <i class="fa fa-group"></i>
                            <span>Users</span>
                        </a>
                    </li>
                    <li ng-class="{active: $route.current.activetab=='agent'}">
                        <a href="#!agent">
                            <i class="fa fa-group"></i>
                            <span>Broker/SO</span>
                        </a>
                    </li>
                    <li ng-class="{active: $route.current.activetab=='distributors'}">
                        <a href="#!distributors">
                            <i class="fa fa-group"></i>
                            <span>Traders</span>
                        </a>
                    </li>
                    <li ng-class="{active: $route.current.activetab=='invoices'}">
                        <a href="#!invoices">
                            <i class="fa fa-newspaper-o"></i>
                            <span>Invoices</span>
                        </a>
                    </li>
                    <li ng-class="{active: $route.current.activetab=='pending_invoices'}">
                        <a href="#!pending_invoices">
                            <i class="fa fa-newspaper-o"></i>
                            <span>Pending Invoices</span>
                        </a>
                    </li>
                    <li ng-class="{active: $route.current.activetab=='import_invoices'}">
                        <a href="#!import_invoices">
                            <i class="fa fa-upload"></i>
                            <span>Import Invoices</span>
                        </a>
                    
                        <!-- <ul class="dropdown-menu">
                            <li><a href="#">Inbox</a></li>
                            <li><a href="#">Drafts</a></li>
                            <li><a href="#">Sent Items</a></li>
                            <li class="divider"></li>
                            <li><a href="#">Trash</a></li>
                        </ul> -->
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right">
                    <li class="pull-right"><a href="#" onclick="javascript:window.location.href='index?action=logout'">
                   <i class="fa fa-sign-out"></i><span> Logout</span></a></li>
                    <!-- <li class="dropdown">
                        <a href="#" data-toggle="dropdown" class="dropdown-toggle">Logout <b class="caret"></b></a>
                        <ul class="dropdown-menu">
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Another action</a></li>
                            <li class="divider"></li>
                            <li><a href="#">Settings</a></li>
                        </ul>
                    </li> -->
                </ul>
            </div><!-- /.navbar-collapse -->
        </div>
    </nav>
    <!-- #Top Bar -->
   
<div ng-view class="w3-animate-zoom"></div>


    <!-- Bootstrap Core Js -->
    <script src="js/bootstrap.min.js"></script>

    <!-- Select Plugin Js -->
    <script src="js/bootstrap-select.min.js"></script>

    <!-- Slimscroll Plugin Js -->
    <script src="js/jquery.slimscroll.js"></script>

    <!-- Waves Effect Plugin Js -->
    <script src="js/waves.min.js"></script>

    <!-- Custom Js -->
    <script src="js/admin.js"></script>

    <!-- Demo Js -->
    <script src="js/demo.js"></script>
    <script type="text/javascript">
    window.setTimeout(function() {
        $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove(); 
        });
    }, 4000);
$('#clearBtn').click(function(){
    alert('ok');
  $('#file').val('');
});

function uploadExcel()
{
  var val=$('#file').val();
  if(val!='')
  {
    setTimeout(function()
    {
      $('#file').val('');
    },1000);   
  }
}
</script>
</body>
</html>