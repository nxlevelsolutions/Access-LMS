<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="course_scorm.aspx.cs" Inherits="NXLevel.LMS.course_scorm" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title></title>
    <meta http-equiv="x-ua-compatible" content="IE=edge" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="expires" content="-1" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />        
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <script language="javascript" src="js/utils.js"></script>
	<script language="javascript" src="js/scorm.js"></script>
	<script language="javascript">
 
    function loadCourse(){
        var title = Utils.getQueryVariable("title"),
            assigId = Utils.getQueryVariable("aid"),
            courseId = Utils.getQueryVariable("cid"),
            userId = Utils.getQueryVariable("uid");
        if (title) { document.title = title }

        API.loadInitData(userId, assigId, courseId, "", function (ret) {
            window.frames[0].location.href = Utils.getQueryVariable("url"); //load course
            if (window.opener.lms) {//update curriculum page
                window.opener.lms.refreshDisplay(assigId, courseId);
            }
        });
    }

	</script>
  </head>
<frameset rows="100%,0" cols="*" frameborder="NO" border="0" framespacing="0" onLoad="loadCourse()">
  <frame src="about:blank" />
  <frame src="admin/LmsMessage.ashx?m=KEEP_SESSION_ALIVE&secs=300" />
</frameset>
</html>