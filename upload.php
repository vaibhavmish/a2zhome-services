<?php 

if(isset($_FILES) && $_GET['image_type']=='upload_photo'){
	
	$allowed = array('png', 'jpg','PNG','JPG');
	   
	     if(isset($_FILES['file']) && $_FILES['file']['error'] == 0 && ($_FILES['file']['size']/1024<='1024')){

	     $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
	     if(!in_array(strtolower($extension), $allowed)){
	     echo '{"status":"error"}';
	     exit;
	    }
	    // $img_ext = explode('.',$_FILES['file']['name']);

	  
	   // define ('SITE_ROOT', realpath(dirname(__FILE__)));

     
	     if(move_uploaded_file($_FILES['file']['tmp_name'],$_SERVER['DOCUMENT_ROOT'].'/invokertech-client-web/upload_img/'.$_FILES['file']['name'])){
	     
	    	$img_path = '../invokertech-client-web/upload/'.$_FILES['file']['name'];
	    	 //	$res = $this->M_User->upload_profile_img($user_id,$img_path);
	   
	     echo $img_path;
	    	return true;
	    
	    }
}
}elseif(isset($_FILES) && $_GET['image_type']=='icon')
{
	//print_r($_GET);
		$allowed = array('png', 'jpg','PNG','JPG');
	   
	     if(isset($_FILES['file']) && $_FILES['file']['error'] == 0 && ($_FILES['file']['size']/1024<='1024')){

	     $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
	     if(!in_array(strtolower($extension), $allowed)){
	     echo '{"status":"error"}';
	     exit;
	    }
	    // $img_ext = explode('.',$_FILES['file']['name']);

	  
	   // define ('SITE_ROOT', realpath(dirname(__FILE__)));

     
	     if(move_uploaded_file($_FILES['file']['tmp_name'],$_SERVER['DOCUMENT_ROOT'].'/invokertech/assets/upload/icon/'.$_FILES['file']['name'])){
	     
	    	$img_path = '../invokertech/assets/upload/icon/'.$_FILES['file']['name'];
	    	 //	$res = $this->M_User->upload_profile_img($user_id,$img_path);
	   
	     echo $img_path;
	    	return true;
	    
	    }
}
}

?>