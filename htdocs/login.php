<?php session_start(); ?>
<?php
	include("mysql_connect.inc.php");

	// some code
	$uname = $_POST["uname"];
	$pwd = $_POST["pwd"];

	$sql = "SELECT * FROM Users WHERE userid = '$uname'";
	$result = mysql_query($sql);
	$row = @mysql_fetch_row($result);
	
	if(isset($_SESSION['user']) && !empty($_SESSION['user']))
	{
		echo "You have login in the same browser!!";
		echo "<meta http-equiv=REFRESH CONTENT=1;url=index.html>";
	}
	else
	{
		if ($uname != null && $pwd != null)
		{
			//$md5_pwd = md5($pwd);
			if ($row[1] == $uname && $row[2] == $pwd)
			{
			// update last online
			//	$now = date('Y-m-d H:i:s');
			//	$sqlUpdate = "UPDATE User SET lastOnline='$now' WHERE uname='$uname'";
			//	mysql_query($sqlUpdate);

				// create user object
				//$player = new user($row[0],$row[1],$row[3],$row[5],"online");

				//$_SESSION['user'] = serialize($player);
				$_SESSION['user'] = $row[1]; // store uname into session
				$count = 0;
				$_SESSION['count'] = $count;
				echo '<link rel="stylesheet" href="style_login.css">';
				echo '<div style="position: fixed; top: 30%;left: 30%;margin-top: -40px;margin-left: 0px;">';
				echo "<div style='color: white; font-size: 17px'>login success!!</div>";
				echo "<br>";
				echo '<div><img src="processing1.gif"></div>';
				echo "</div>";
				echo "<meta http-equiv=REFRESH CONTENT=1;url=lobby.php>";
				//echo '<script>';
				//echo "window.open('lobby.php','_blank');";
				//echo "</script>";
			 }
			 else
			 {
				echo "login fail!!";
				echo "<meta http-equiv=REFRESH CONTENT=1;url=index.html>";
			 }
		}
		else
		{
			echo "login fail!!";
			echo "<meta http-equiv=REFRESH CONTENT=1;url=index.html>";
		}
	}
	//mysql_close($con); 

?>