<!DOCTYPE html>
<!--[if lt IE 7]> <html class="lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]> <html class="lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]> <html class="lt-ie9" lang="en"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title>Super Battle Tank</title>
  <script src="http://code.jquery.com/jquery-latest.js"></script>
  <link rel="stylesheet" href="style_reg.css">
  <!--[if lt IE 9]><script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script><![endif]-->
</head>

<body>

	
  <section class="container">
  <br>
  <center>  <img alt="" src="logo1.png" height="129" width="418"></center> 
  <br>

    <div class="login">
      <h1>Register a Tank War account</h1>
      <form method="post" action="checkreg.php">
        <p><input type="text" name="uname" value="" placeholder="Username" required></p>
        <p><input type="password" name="pwd" value="" placeholder="Password" required></p>
		<p><input type="password" name="cpwd" placeholder="Confirm password" required></p>
		<?php
		if($_GET['opencaptcha']=='failed') { echo "<script>alert('You Did Not Fill In The Security Code Correctly');</script>";}
		$date = date("Ymd");
		$rand = rand(0,9999999999999);
		$height = "80";
		$width  = "240";
		$img    = "$date$rand-$height-$width.jpgx";
		
		echo "<input type='hidden' name='img' value='$img'>";
		echo "<a href='http://www.opencaptcha.com'><img src='http://www.opencaptcha.com/img/$img' height='$height' alt='captcha' width='$width' border='0' /></a>";
		//echo  "Enter the code: "."<input type=text name=code value='' size='35' /><br>";
		echo "<p><input type='text' name='code' value='' placeholder='Enter the above code' required size='35'></p>";
		?>
		
        </p>
        <p class="submit"><input type="submit" name="commit" value="register" ></p>
      </form>
    </div>

    <div class="login-help">
      <p>Already got an accout? <a href="index.html">Back to the login page</a>.</p>
    </div>
  </section>

</body>
</html>