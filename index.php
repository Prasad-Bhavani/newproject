<?php
include_once('db/config.php');
include_once('db/functions.php');
include_once('db/user_functions.php');

if(isset($_POST['login']))
{
    if(!empty($_POST['userid']) && !empty($_POST['password']))
    {
        $res=checkLogin();
        if($res==2)
        {
            $msg='Your Account has been deactivated. Please Contact your Administrator';
            $cls='warning';
        }
        else
        {
            $msg='Invalid Login Details. Please try Again...';
            $cls='danger';
        }
    }
}

if(isset($_GET['action']) && $_GET['action']=='logout')
{
    if(!empty($_SESSION[SID]))
    {
        unset($_SESSION[SID]);
        $_SESSION['msg']='You have successfully logged out';
        $_SESSION['cls']='success';
        redirect('index');
    }
    else redirect('index');
}

if(!empty($_SESSION[SID]))
{
    redirect('home');
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
    <title><?php echo TABTITLE;  ?></title>
    <!-- Favicon-->
    <link rel="icon" href="<?php echo TABICON;  ?>" type="image/x-icon">

    <!-- Google Fonts -->
    <link href="css/icon.css" rel="stylesheet" type="text/css">

    <!-- Bootstrap Core Css -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Waves Effect Css -->
    <link href="css/waves.min.css" rel="stylesheet" />

    <!-- Custom Css -->
    <link href="css/style.css" rel="stylesheet">
<style type="text/css">
.error
{
    position: absolute;
}
body
{
    background: url('images/bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% !important;
    background-color: #88b76f !important;
}
</style>
</head>

<body class="login-page">
<?php if(isset($msg) && !empty($msg)){?>
    <div class="alert alert-<?php echo $cls; ?> alert-dismissable msgcss">
  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
  <?php echo $msg; ?>
</div>
<?php }else if(isset($_SESSION['msg']) && !empty($_SESSION['msg'])) {?>
    <div class="alert alert-<?php echo $_SESSION['cls']; ?> alert-dismissable msgcss">
  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
  <?php echo $_SESSION['msg']; ?>
</div>
<?php unset($_SESSION['msg']); unset($_SESSION['cls']); } ?>

    <div class="login-box">
        <div class="logo" align="center">
            <a href="javascript:void(0);"><img style="display: inline-block;" src="images/logo.png" class="img-responsive" /></a>
        </div>
        <div class="card">
            <div class="body">
                <form id="loginForm" name="loginForm" method="POST" autocomplete="off">
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">person</i>
                        </span>
                        <div class="form-line">
                            <input type="text" class="form-control" name="userid" id="userid" placeholder="User ID" onblur='this.placeholder="User ID"' onfocus='this.placeholder=""' required autofocus value="<?php if(isset($_POST['userid'])) echo $_POST['userid'] ?>">
                        </div>
                    </div>
                    <div class="input-group">
                        <span class="input-group-addon">
                            <i class="material-icons">lock</i>
                        </span>
                        <div class="form-line">
                            <input type="password" class="form-control" name="password" placeholder="Password" required onblur='this.placeholder="Password"' onfocus='this.placeholder=""'>
                        </div>
                    </div>
                    <div class="row">
                        <!-- <div class="col-xs-8 p-t-5">
                            <input type="checkbox" name="rememberme" id="rememberme" class="filled-in chk-col-pink">
                            <label for="rememberme">Remember Me</label>
                        </div> -->
                        <div class="col-xs-8">
                            <button class="btn btn-primary waves-effect" type="submit" name="login" id="login">LOGIN</button>
                            <?php if(isset($_POST['userid'])) {?>
                            <button class="btn bg-black waves-effect" type="button" onclick="javascript:window.location.href='?'">CANCEL</button>
                            <?php } else {?>
                            <button class="btn btn-danger waves-effect" type="reset" id="resetbtn">RESET</button>
                            <?php } ?>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Jquery Core Js -->
    <script src="js/jquery.min.js"></script>

    <!-- Bootstrap Core Js -->
    <script src="js/bootstrap.min.js"></script>

    <!-- Waves Effect Plugin Js -->
    <script src="js/waves.min.js"></script>

    <!-- Validation Plugin Js -->
    <script src="js/jquery-1.12.0.min.js"></script>
    <script src="js/jquery.validate.min.js"></script>

    <!-- Custom Js -->
    <script src="js/admin.js"></script>
    <script type="text/javascript">
        $('#loginForm').validate({
        rules: {
            'userid': {
                required: true
            },
            'password': {
                required: true
            }
        },
        messages: {
            'userid': {
                required: "Please Enter User ID"
            },
            'password': {
                required: "Please Enter Password"
            }
        },
        highlight: function (input) {
            $(input).parents('.form-line').removeClass('success');
            $(input).parents('.form-line').addClass('focused');
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
            $(input).parents('.form-line').addClass('focused');
            $(input).parents('.form-line').addClass('success');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
        }
    });

    $('#resetbtn').click(function(){
        $('#loginForm').validate().resetForm();
        $('#loginForm div').removeClass('error');
        $('#loginForm div').removeClass('focused');
        $('#loginForm div').removeClass('success');
        // $('#userid').focus();
    });

    window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
}, 4000);
    </script>
</body>
</html>