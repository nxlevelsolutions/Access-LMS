<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Curriculum.aspx.cs" Inherits="NXLevel.LMS.Curriculum" %>

<%@ Import Namespace="NXLevel.LMS" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="js/lms.js"></script>
    <script language="javascript">
        var courseWin = null;
        function openCourse(url, assigId, courseId, title, isAICC, isSCORM, toolbar, status, width, height) {
            var params = "dependent,toolbar=" + (toolbar ? "yes" : "no") + ",status=" + (status ? "yes" : "no") + ",menubar=no,scrollbars=no,resizable=no,width=" + width + ",height=" + height;

            if (isAICC) {
                lmsListener = document.location.href.substr(0, document.location.href.lastIndexOf('/')) + "/aicc.aspx";
                url += "?aicc_url=" + escape(lmsListener) + "&aicc_sid=<% =LmsUser.UserId %>|" + courseId + "|" + assigId;
                courseWin = window.open(url, "courseWin", params);
                watchStatus(assigId, courseId);
            }
            else if (isSCORM) {
                courseWin = window.open("course_scorm.aspx?cid=" + courseId + "&url=" + escape(url) + "&title=" + escape(title) + "&uid=<%=LmsUser.UserId%>&aid=" + assigId, "courseWin", params);
            }
            else { //this is a non-aicc and non-scorm activity
                courseWin = window.open("course.aspx?cid=" + courseId + "&url=" + escape(url) + "&title=" + escape(title) + "&uid=<%=LmsUser.UserId%>&aid=" + assigId, "courseWin", params);
            }

            //check popup blocker
            if (!courseWin) {
                alert("A popup blocker has been detected in your browser. \nIn order to run this course, you need to disable any pop-up blockers running on your machine.");
            }
            else {
                courseWin.focus();
            }
        }

        function watchStatus(assigId, courseId) {
            if (courseWin && courseWin.closed) {
                document.location.href = document.location.href; //full page refresh
            }
            else {
                setTimeout(function () {
                    lms.refreshDisplay(assigId, courseId);
                    watchStatus(assigId, courseId);
                }, 5000, assigId, courseId) //refresh tile every 5secs
            }
        }

        function viewCertificate(assigId, courseId) {
            certWin = window.open("admin/certificate.aspx?cid=" + courseId + "aid=" + assigId, 800, 600);
        }

        $(document).ready(function () {
            lms.initialize(<%=LmsUser.UserId%>);
            lms.refreshDisplay();
            $('div.disabled div.title a').attr("href", null); //remove click from disabled courses
        });


    </script>
    <style type="text/css">
        .certificate {
            display: none;
            Xwidth: 107px;
        }
        .tile {
            float: left;
            padding: 10px 25px;
            width: 346px;
            min-height: 120px;
            background-color: aliceblue;
            margin: 15px;
            border: 1px solid lightblue;
            border-radius: 10px;
  -webkit-box-shadow: 2px 2px 8px rgba(0, 0, 0, .5);
          box-shadow: 2px 2px 8px rgba(0, 0, 0, .5);
        }
        .title{
            font-weight:bolder;
            text-align:center;
            letter-spacing:1px;
        }
        @media  (max-width: 991px) {
            .tile {
                width: 100%;
                margin: 15px 0px;
            }
        }

    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="fa fa-book"></span> My Curriculum</h3>
    </div>

    <asp:Repeater ID="rptCourses" runat="server" EnableViewState="false">
        <ItemTemplate>
            <div class="tile <%# (bool)Eval("available") ? "": "disabled" %>">
                <div courseid='<%# Eval("courseId") %>' assigid='<%# Eval("assignmentId") %>'>
                    <div class="title">
                        <a href="javascript:openCourse('<%# Eval("url") %>', <%# Eval("assignmentId") %>, <%# Eval("courseId") %>,'<%# Eval("title") %>', <%# Eval("aicc").ToString().ToLower() %>, <%# Eval("scorm").ToString().ToLower() %>, <%# Eval("browserToolbar").ToString().ToLower() %>, <%# Eval("browserStatus").ToString().ToLower() %>, <%# Eval("browserWidth") %>, <%# Eval("browserHeight") %>)">
                           <%# Eval("orderId")==null ? "": Eval("orderId")+")" %> <%# Eval("title") %>
                        </a>
                        <button type="button" id="certificate" class="btn btn-md btn-primary certificate" onclick='viewCertificate(<%# Eval("assignmentId") %>, <%# Eval("courseId") %>)'>Download Certificate &nbsp;<span class="fa fa-download"></span></button>
                    </div>
                    <table width="80%" align="center">
                        <tr>
                            <td>Started:</td>
                            <td><span id="startDate"></span></td>
                        </tr>
                        <tr>
                            <td>Completed:</td>
                            <td><span id="completedDate"></span></td>
                        </tr>
                        <tr>
                            <td>High score:</td>
                            <td><span id="highScore"></span></td>
                        </tr>
                    </table>
                </div>
            </div>
        </ItemTemplate>
    </asp:Repeater>


</asp:Content>
