<?php
include_once("settings.php");

// Initialization
$db = new PDO("mysql:host=${database_server}", $database_user, $database_pw);

// Remove old database
$sql = <<<STR
	DROP DATABASE IF EXISTS `friend`;
STR;

$db->exec($sql);

// Set Database mode
$sql = <<<STR
	SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
STR;

$db->exec($sql);

// Create new database
$sql = <<<STR
	CREATE DATABASE `friend` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
STR;

$db->exec($sql);

// Use new database
$sql = <<<STR
	USE `friend`;
STR;

$db->exec($sql);

// Create users table
$sql = <<<STR
	CREATE TABLE `users` (
	  `id` int(10) NOT NULL AUTO_INCREMENT,
	  `userid` varchar(15) NOT NULL,
	  `password` varchar(15) NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;
STR;

$db->exec($sql);


echo "Initialization Successful!.";