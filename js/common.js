var user_info ='';
function check_for_login(){
 jQuery.ajax({
url:'sessions.php',
data:'check_login=check_login',
type:'POST',
dataType:'json',
success:function(data){
if(data.msg =='valid'){
  
}else{
window.location.href = '';
}


}
}); 
}
jQuery.ajax({
url:'sessions.php',
data:'check_login=check_login',
type:'POST',
beforeSend:function(){
  jQuery('body').addClass('loader_g');
//jQuery('body').css('background','##f5f2f0 url(img/logo/Preloader_1.gif)no-repeat center center');
},
dataType:'json',
success:function(data){
if(data.msg =='valid'){
 // console.log(data.data);
  jQuery('#user_info').text(data.data.name);
  jQuery('#user_id').val(data.data._id);
 jQuery('#b_first_name').val(data.data.name.split(' ')[0]);
 jQuery('#b_last_name').val(data.data.name.split(' ')[1]);
  jQuery('#b_email').val(data.data.email);
   jQuery('#b_number').val(data.data.number);
   jQuery('#login_logout').hide();
   jQuery('#user_pro').show();
   jQuery('.hdr_selected_city').text(data.data.city);
   if(window.location.href.indexOf("home.veiw.html")>-1)
    {angular.element(document.getElementById('ng-control')).scope().current_services(data.data.city);
}
   setTimeout(function(){jQuery('.service_list').val(data.data.city)},1000);
   
   jQuery('#user_info').text(data.data.name);
    jQuery('#logout').show();
    user_info = data.data;
    jQuery('body').removeClass('loader_g');
//console.log(user_info);
}else{
  jQuery('#id05').show();
//window.location.href = '';
}


}
});

jQuery('#logout').click(function(){

jQuery.ajax({
url:'sessions.php',
data:'logout=logout',
type:'POST',
dataType:'json',
success:function(data){
window.location.href='';

}
});
});



jQuery('#login_user').click(function(){

u_login(jQuery('#l_username').val(),jQuery('#l_password').val());
});
function u_login(l_username,l_password){
if(l_username!='' && l_password!=''){
  
jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/user/login',
data:'email='+l_username+'&password='+l_password,
type:'POST',
success:function(data){
  console.log(data);
  if(data.message == 'user-not-found' || data.message=='invalid'){
    swal('Error','Wrong Credentials','error');
  }else{
    jQuery.ajax({
    url:'sessions.php',
   data:'start_session='+JSON.stringify(data)+'&city='+jQuery('.service_list').val(),
   type:'POST',
   success:function(data){
window.location.href = '';
   }
    });
  }
  setTimeout(function(){
  //  window.location.href = '';
  },1000);
}
});
}else{
  swal('Error','Please Fill All Fields','error');
}
}

jQuery('#register-submit').click(function(event){
  event.preventDefault();
if(jQuery('#username').val()!='' && jQuery('#email').val()!='' && jQuery('#number').val()!='' && jQuery('#password').val()!=''){
jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/send/otp',
data:'number='+jQuery('#number').val(),
type:'POST',

success:function(data){
  if(typeof data.id!=='undefined'){
    //swal('Success','otp has been sent to your mobile number','success');
    jQuery('#otp_value_id').val(data.id);
       jQuery('#id02').hide();
      jQuery('#id099').show();
      jQuery('#otp_id').val(data.id);
      

  }
 // swal('Saved','Congrates Account has been created','success');
  
}
});
}else{
  swal('Error','Please Fill All Fields','error');
}
});

jQuery('#send_opt').click(function(event){
  event.preventDefault();
if(jQuery('#otp_value').val()!=''){
jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/verify/otp',
data:'otp='+jQuery('#otp_value').val()+'&id='+jQuery('#otp_value_id').val(),
type:'POST',
success:function(data){
 if(data.message=='not matched'){
   swal('Error','Otp Did not match','error');
 }else if(data.message=='expired'){
  swal('Error','Otp expired','error');
 }else if(data.message=='matched'){
  jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/user/register',
data:'name='+jQuery('#username').val()+'&email='+jQuery('#email').val()+'&number='+jQuery('#number').val()+'&pass='+jQuery('#password').val(),
type:'POST',
success:function(){
  swal('Saved','Congrates Account has been created','success');
  u_login(jQuery('#email').val(),jQuery('#password').val());
}
});
 }
 // swal('Saved','Congrates Account has been created','success');
  
}
});
}else{
  swal('Error','Please Fill All Fields','error');
}
});
jQuery('#save_msg').click(function(){
if(jQuery('#m_name').val()!='' && jQuery('#m_email').val()!='' && jQuery('#m_phone').val()!='' && jQuery('#m_msg').val()!=''){
jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/save/message',
type:"POST",
data:'name='+jQuery('#m_name').val()+'&m_email='+jQuery('#m_name').val()+'&m_phone='+jQuery('#m_name').val()+'&m_msg='+jQuery('#m_name').val()+'&location='+jQuery('.service_list').val(),
success:function(){
  swal('THANKS!','OUR EXECUTIVE WILL CONTACT YOU SHORTLY','success');
 jQuery('#m_name').val('') ;
 jQuery('#m_email').val('') ;
 jQuery('#m_phone').val('') ;
 jQuery('#m_msg').val('')
}
});
}else{
  swal('Error','Please All the Field','error');
}
});

$( "#rb_send" ).click(function() {
  //  if(typeof user_info._id!=='undefined' && user_info._id!=''){
if(jQuery('#rb_first_name').val()!='' && jQuery('#rb_last_name').val()!='' && jQuery('#rb_email').val()!='' && jQuery('#rb_number').val()!=''  ){
  jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/send/otp',
data:'number='+jQuery('#rb_number').val(),
type:'POST',
success:function(data){
 // swal('Thanks','Otp has been sent to your number','success');
  jQuery('#id0991').show();
jQuery('#rb_otp_value_id').val(data.id);
}
});
}else{
swal('Error','Please fill all the fields','error');
}
//}else{
 // swal('Error','Please Login first','error');
//}
});



$('#rb_otp_send').click(function(){
if(jQuery('#rb_otp_value').val()!=''){
jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/verify/otp',
data:'otp='+jQuery('#rb_otp_value').val()+'&id='+jQuery('#rb_otp_value_id').val(),
type:'POST',
success:function(data){
 if(data.message=='not matched'){
   swal('Error','Otp Did not match','error');
 }else{
jQuery.ajax({
url:'https://handy-service-server.herokuapp.com/request/callback',
data:'name='+jQuery('#rb_first_name').val()+' '+jQuery('#rb_last_name').val()+'&email='+jQuery('#rb_email').val()+'&mobile='+jQuery('#rb_number').val()+'&location='+jQuery('#service_list').val()+'&type='+jQuery('[name=feedback_type]').val()+'&user_id='+jQuery('#user_id').val(),
type:'post',
success:function(data){
swal('Thanks','We will reach you as soon as possible','success');

}
});
}}
});
}
else{
  swal('Error','Please fill all the fields');
}
});
setTimeout(function(){},2000);

