<?php

if(!isset($_SESSION['user_id']))
{
 header( 'Location: /home.veiw.html' ) ; 
}
?>