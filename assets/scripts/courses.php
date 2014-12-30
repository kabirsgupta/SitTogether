<?php

$json = file_get_contents("http://web-app.usc.edu/web/soc/api/classes/{$_GET['code']}/20151");
header('Content-Type: application/json');
echo $json;