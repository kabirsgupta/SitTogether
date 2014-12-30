<?php

$json = file_get_contents("http://web-app.usc.edu/web/soc/api/depts/20151");
header('Content-Type: application/json');
echo $json;