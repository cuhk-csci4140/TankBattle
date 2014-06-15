CSCI4140 2013/14 Term2 Project	(Submission: 19 May, 2014)	
**********************************************************
Group : The No. 2 (Group 21)
Project: Tank Battle Multi-player Online Web Game
Members:
CHAN Ka Yun
CHUNG Pui Hang
CHENG Wing Yan
LEUNG Kam Choi

How to deploy the game.
======================

Testing platform: 
----------------------
Window XP ... (Sorry)
Google Chrome Browser

Tools:
---------------
Apache Server
PHP
MySQL 
node.js (Windows version) + websocket module

Deployment Steps
-------------------
1. Put the whole "htdocs" folder into web root.
2. Edit "settings.php" for setting server parameters.
3. Start web server for chatting:      " node WebServer.js"
4. Start game server for game synchronization:       "node GameServer.js"
5. Go to URL: XXX/init.php   for initialization.
6. Go to URL: XXX/index.html     and enjoy the game.

