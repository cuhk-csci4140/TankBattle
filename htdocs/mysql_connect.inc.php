<?php
include_once("settings.php");

$db_server = $database_server;
//��Ʈw�W��
$db_name = "friend";

$db_user = $database_user;

$db_passwd = $database_pw;

//���Ʈw�s�u
if(!@mysql_connect($db_server, $db_user, $db_passwd))
        die("�L�k���Ʈw�s�u");


//��ܸ�Ʈw
if(!@mysql_select_db($db_name))
        die("�L�k�ϥθ�Ʈw");
?> 