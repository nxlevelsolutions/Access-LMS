﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Curriculum.aspx.cs" Inherits="NXLevel.LMS.Curriculum" %>
<%@ Import Namespace="NXLevel.LMS" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="js/lms.js"></script>
    <script language="javascript">
        var courseWin = null;
        function openCourse(url, assigId, courseId, title, type, width, height) {
            var params = "dependent,menubar=no,scrollbars=no,resizable=no,width=" + width + ",height=" + height;

            if (type == <% =(int)CourseType.AICC %>) {
                lmsListener = document.location.href.substr(0, document.location.href.lastIndexOf('/')) + "/aicc.ashx";
                url += "?aicc_url=" + escape(lmsListener) + "&aicc_sid=<% =LmsUser.UserId %>|" + courseId + "|" + assigId;
                courseWin = window.open(url, "courseWin", params);
                watchStatus(assigId, courseId);
            }
            if (type == <% =(int)CourseType.SCORM %>) {
                courseWin = window.open("course_scorm.aspx?cid=" + courseId + "&url=" + escape(url) + "&title=" + escape(title) + "&uid=<%=LmsUser.UserId%>&aid=" + assigId, "courseWin", params);
            }
            if (type == <% =(int)CourseType.READ_AND_SIGN %>) {
                $('#pnReadAndSign h3').html(title);
                $('#pnReadAndSign iframe').attr('src', 'courses/ReadAndSign.aspx?cid=' + courseId + "&aid=" + assigId + "&uid=<%=LmsUser.UserId%>");
                $('#pnReadAndSign').modal({ show: true });  
                return;
            }
             
            //check popup blocker
            if (!courseWin) {
                alert("<%= GetLocalResourceObject("ErrorPopBlocker")%>");
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

        $(document).ready(function () {
            $("#pnReadAndSign").draggable({ handle: ".modal-header" });
            lms.initialize(<%=LmsUser.UserId%>);
            lms.refreshDisplay();
            $('div.disabled div.title a').attr("href", null); //remove click from disabled courses
        });

        $(window).unload(function () {
            if (courseWin) courseWin.close();
        });

    </script>
    <style type="text/css">

        .tile {
            padding: 10px 25px;
            width: 100%;
            Xmin-height: 116px;
            background-color: #fff;
            margin: 15px;
            border: 1px solid lightgray;
            border-radius: 4px;
            -webkit-box-shadow: 2px 2px 10px rgba(0, 0, 0, .2);
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, .2);
        }
        .title{
            font-weight:bolder;
            letter-spacing:1px;
        }
        .assignment{
            border-bottom: 1px solid lightgray;
            padding: 0 0 10px 0;
        }

        /* hide certain things  */
        #highScore{
            display:none;
        }
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="glyphicon glyphicon-education"></span> <%= GetLocalResourceObject("PageTitle")%></h3>
    </div>

    <h4><asp:Label runat="server" ID="LblAllDone" Text="Nice work! You are up to date and have no current assignments."></asp:Label></h4>

    <asp:Repeater ID="rptAssignments" runat="server">
        <ItemTemplate>
            <div class="assignment">

                <h4><%# Eval("title") %></h4>
                <p><%# Eval("description") %></p>

                <asp:Repeater ID="rptCourses" runat="server" EnableViewState="false" DataSource='<%# GetCourses((int)Eval("assignmentId")) %>'>
                    <ItemTemplate>
                        <div class="tile <%# (bool)Eval("available") ? "": "disabled" %>">
                            <div courseid='<%# Eval("courseId") %>' assigid='<%# Eval("assignmentId") %>'>
                                <div class="title">
                                    <span class="fa fa-book"></span>
                                    <a href="javascript:openCourse('<%# Eval("url") %>', <%# Eval("assignmentId") %>, <%# Eval("courseId") %>,'<%# Eval("title") %>', <%# Eval("type") %>, <%# Eval("browserWidth")==null ? "null": Eval("browserWidth") %>, <%# Eval("browserHeight")==null ? "null": Eval("browserHeight") %>)">
                                       <%# (bool)Eval("availCoursesInOrder")==true ? Eval("orderId")+")": "" %> <%# Eval("title") %>
                                    </a>
                                </div>
                                <p><%# Eval("description") %></p>
                                <%= Resources.Global.LabelStarted %>: <span id="startDate"></span> &nbsp;|&nbsp; <%= Resources.Global.LabelCompleted %>: <span id="completedDate"></span> <%--&nbsp;|&nbsp;  <%= Resources.Global.LabelHighScore %>:--%><span id="highScore"></span>
                            </div>
                        </div>
                    </ItemTemplate>
                </asp:Repeater>

            </div>
        </ItemTemplate>
    </asp:Repeater>


    <!-- Read & Sign modal -->
    <div id="pnReadAndSign" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center"></h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="450px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal"><%= Resources.Global.BtnClose %></button>
                </div>
            </div>
        </div>
    </div>

    <iframe id="hiddenFrame" style="width:1px;height:1px" frameborder="0" src="admin/LmsMessage.ashx?m=KEEP_SESSION_ALIVE&secs=600" name="fFrame" scrolling="no" height="1" width="1"></iframe>


</asp:Content>
