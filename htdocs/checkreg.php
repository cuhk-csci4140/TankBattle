<?php
include("mysql_connect.inc.php");

$uname = $_POST['uname'];
$pwd = $_POST['pwd'];
$cpwd = $_POST['cpwd'];

	if(file_get_contents("http://www.opencaptcha.com/validate.php?ans=".$_POST['code']."&img=".$_POST['img'])=='pass')
	{
		if($uname != null && $pwd != null && $cpwd != null && $pwd == $cpwd)
		{
			$now = date('Y-m-d H:i:s');
			//$pwd = md5($pwd);
			$sql = "insert into Users (userid, password) values ('$uname', '$pwd')";
			if(mysql_query($sql))
			{
				echo 'register success!!';
				echo '<meta http-equiv=REFRESH CONTENT=2;url=index.html>';
			}
			else
			{
				echo 'register fail!!';
				echo '<meta http-equiv=REFRESH CONTENT=2;url=register.php>';
			}
		}

	} else {
		echo 'register fail!!';
		echo '<meta http-equiv=REFRESH CONTENT=2;url=register.php>';
	}


?>