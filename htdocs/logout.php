<?php session_start(); ?>

<?php
include("mysql_connect.inc.php");


// clear session
session_unset(); 
//session_destroy(); 
echo '<link rel="stylesheet" href="style_login.css">';

echo '<div style="position: fixed; top: 30%;left: 30%;margin-top: -40px;margin-left: 0px;">';
echo "<div style='color: white; font-size: 17px'>please wait......</div>";
echo '<div><img src="loading1.gif"></div>';
echo "</div>";

echo '<meta http-equiv=REFRESH CONTENT=1;url=index.html>';
?>