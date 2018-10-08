<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Curriculum.aspx.cs" Inherits="NXLevel.LMS.Curriculum" %>
<%@ Import Namespace="NXLevel.LMS" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="js/lms.js"></script>
    <script language="javascript">
    var modWindow = null;
    function openCourse(url, params, courseId, title, isAICC, isSCORM){
	    if (isAICC){
		    lmsListener = document.location.href.substr(0, document.location.href.lastIndexOf('/')) + "/aicc.aspx";
		    url += "?aicc_url=" + escape(lmsListener) + "&aicc_sid=<% =LmsUser.UserId %>|" + courseId;
		    modWindow = window.open(url, "modWindow", params);
	    }
	    else if(isSCORM){
	        modWindow = window.open("course_scorm.aspx?cid=" + courseId + "&url=" + escape(url) + "&title=" + escape(title) + "&uid=<%=LmsUser.UserId%>","modWindow", params);
	    }
	    else{ //this is a non-aicc and non-scorm activity
		    modWindow = window.open("course.aspx?cid=" + courseId + "&url=" + escape(url) + "&title=" + escape(title) + "&uid=<%=LmsUser.UserId%>","modWindow",params);
        }

        //check popup blocker
	    if (!modWindow) {
		    alert("A popup blocker has been detected in your browser. \nIn order to run this course, you need to disable any pop-up blockers running on your machine.");
	    }
	    else{
		    modWindow.focus();
	    }
    }
    function viewCertificate(courseId) {
        certWin = window.open("admin/certificate.aspx?cid=" + courseId, 800, 600);
    }

    $(document).ready(function () {
        lms.initialize(<%=LmsUser.UserId%>, null);
        lms.refreshDisplay();
        $('#course-list tr:even').addClass('row-highlight');
    });


    </script>
    <style type="text/css">
        .certificate{
            display:none;
            width:107px;
        }
        #course-list td{
            padding: 10px;
        }
        #course-list th{
            padding: 10px;
            background-color:lightgray;
        }

    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h2>My Curriculum</h2>
        <table id="course-list" border="0" width="100%" cellspacing="1" cellpadding="2" bgcolor="#000000">
            <tr>
                <th>Courses</th>
                <th>Started</th>
                <th>Completed</th>
		        <th align="center">Highest Score</th>
            </tr>
            <asp:Repeater id="rptCourses" runat="server" EnableViewState="false">
            <ItemTemplate>
                <tr courseId='<%# Eval("courseId") %>'>
                    <td valign="top"><a href="javascript:openCourse('<%# Eval("url") %>', '<%# Eval("jsWinParams") %>',<%# Eval("courseId") %>,'<%# Eval("title") %>', <%# Eval("aicc") %>, <%# Eval("scorm") %>)"><b><%# Eval("title") %></b></a>
                        <div id="certificate" class="certificate" onclick="viewCertificate(<%# Eval("courseId") %>)" >
                             <img border="0" src="images/print_certificate.gif" width="107" height="23" /></a>
                        </div>
                    </td>
                    <td valign="top" id="startDate">&nbsp;</td>
                    <td valign="top" id="completedDate">&nbsp;</td>
                    <td valign="top" id="highScore" align="center">&nbsp;</td>
                </tr>
            </ItemTemplate>
            </asp:Repeater>
        </table>
    </div>
</asp:Content>
