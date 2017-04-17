<?php 
session_start();

if(isset($_POST['start_session']) && $_POST['start_session']!='')
{
	start_session($_POST['start_session'],$_POST['city']);
}
if(isset($_POST['check_login']) && $_POST['check_login']!='')
{
	check_for_session();
}
if(isset($_POST['get_userval']) && $_POST['get_userval']!='')
{
	get_user_info_byId($_POST['get_userval']);
}
if(isset($_POST['logout']) && !empty($_POST['logout']))
{
	des_session();
}
function start_session($val,$city){

	
$_SESSION['invoker'] = json_decode($val,true); 
$_SESSION['invoker']['city'] = $city;
//print_r($_SESSION);

}

function check_for_session(){

	//print_r($_SESSION);
	if(isset($_SESSION['invoker']) && !empty($_SESSION['invoker'])){
		echo json_encode(array('msg'=>'valid','data'=>$_SESSION['invoker']));
	}else{
		echo json_encode(array('msg'=>'invalid'));
	}
}



function get_user_info_byId($id){
	echo json_encode($_SESSION);
}

function des_session(){
	unset($_SESSION['invoker']);
	session_destroy();
	echo json_encode(array('mesg'=>'success'));
}





?>