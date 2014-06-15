<?php
include_once("settings.php");

$db_server = $database_server;
//資料庫名稱
$db_name = "friend";

$db_user = $database_user;

$db_passwd = $database_pw;

//對資料庫連線
if(!@mysql_connect($db_server, $db_user, $db_passwd))
        die("無法對資料庫連線");


//選擇資料庫
if(!@mysql_select_db($db_name))
        die("無法使用資料庫");
?> 