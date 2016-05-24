<?php

header("Content-type:text/html;charset=UTF-8");
$comments = file_get_contents('demo.json');
$commentsArr = json_decode($comments);
$count = count($commentsArr);

if ($_POST) {
	$num = $_POST["num"] - 1;
	$num = $num < $count ? $num : $count - 1;
	echo json_encode($commentsArr[$num]);
}




?>