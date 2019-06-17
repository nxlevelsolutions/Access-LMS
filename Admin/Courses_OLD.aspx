<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Courses.aspx.cs" Inherits="NXLevel.LMS.Admin.Courses" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="../js/demo_AICC.js"></script>    <script src="../js/demo_SCORM.js"></script>
    <style type="text/css">
        .logWin {
            height: 400px;
            border: 1px solid lightgray;
            background-color: aliceblue;
            border-radius: 4px;
            padding: 10px;
            display: none;
        }

        .scormLog, .aiccLog{
            font-family: 'Courier New';
            font-size: 11px;
        }

            .scormLog tr {
                background-color: unset !important;
            }
    </style>
    <script language="javascript">

        var popName;

        function openCourseEditor(courseId) {
            popName = "courseEditor";
            $('#' + popName + ' iframe').attr('src', 'CourseEditor.aspx' + (courseId == null ? '' : '?cid=' + courseId));
            $('#' + popName + ' #saveBtn').prop("disabled", false);
            $('#' + popName).modal({ show: true });
        }

        function openUploadEditor(courseId) {
            popName = "uploadEditor";
            $('#' + popName + ' iframe').attr('src', 'UploadEditor.aspx' + (courseId == null ? '' : '?cid=' + courseId));
            $('#' + popName + ' #saveBtn').prop("disabled", false);
            $('#' + popName).modal({ show: true });
        }

        function onSave() {
            $('#' + popName + ' #saveBtn').prop("disabled", true);
            $('#' + popName + ' iframe')[0].contentWindow.onSave();
        }

        function closeWin(refresh) {
            $('#' + popName).on("hidden.bs.modal", function () {
                if (refresh) document.location.href = document.location.href;
            });
            $('#' + popName).modal("hide");
        }

        function runCourse(courseId, containerId) {

            containerId = '#' + containerId;
            $(".logWin").hide(); 
            $(".scormLog").hide();
            $(".aiccLog").hide();
            
            $.ajax({
                type: "GET",
                url: "LmsMessage.ashx?m=COURSE_LAUNCH_PARAMS&uid=0&cid=" + courseId + "&r=" + Math.random(),
                async: false,
                success: function (data) {
                    // show log
                    if (data.isScorm) {
                        if (API.containerId!=containerId) {
                            API.Start(containerId);    
                        }
                        $(containerId + " .scormLog").show();
                        $(containerId + " .logWin").show("blind", {}, 1000);
                    }
                    if (data.isAICC) {
                        if (AICC.containerId != containerId) {
                            AICC.Start(containerId);
                        }
                        $(containerId + " .aiccLog").show();
                        $(containerId + " .logWin").show("blind", {}, 1000);
                    }

                    // data.title
                    var modWin = window.open("../" + data.url + (data.isAICC ? "?AICC_SID=123&AICC_URL=<%= ResolveUrl("~/admin/aicc.asp") %>" : ""),
                        "previewWindow", "dependent,menubar=no,scrollbars=no" +
                        ",toolbar=" + (data.toolbar ? "yes" : "no") +
                        ",width=" + data.width +
                        ",height=" + data.height);
                    if (modWin) {
                        modWin.focus();
                    }
                    else {
                        alert("A popup blocker has been detected in your browser. \nIn order to run this course, you need to disable any pop-up blockers running on your machine.");
                    }
                },
                error: function (xhr, ajaxOptions, err) {
                    Utils.log("Review setMessage ERROR: '" + ajaxOptions + "':" + err.message);
                }
            });
        }

        $(document).ready(function () {
            $("#courseEditor").draggable({ handle: ".modal-header" });
            $("#uploadEditor").draggable({ handle: ".modal-header" });
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="fa fa-book"></span> Courses</h3>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <button type="button" class="btn btn-md btn-primary" onclick='openUploadEditor(null)'><span class="fa fa-plus"></span> NEW COURSE</button>
        </div>
        <asp:Repeater ID="rptCourseList" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor" id="usersList">
                    <tr>
                        <th>Title</th>
                        <th class="text-center">Enabled</th>
                        <th class="text-center">Course Package</th>
                        <th class="text-center">Preview</th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr id="cont<%# Eval("courseId") %>">
                    <td>
                        <a onclick='openCourseEditor(<%# Eval("courseId") %>)'><%# Eval("title") %></a>
                        <div class="logWin">
                            <b>Course Log:</b> <span class="glyphicon glyphicon-chevron-up close" onclick="$('.logWin').hide('blind', {}, 1000)"></span>
                            <div class="scormLog">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td width="20%">Student Name: </td>
                                        <td>
                                            <input name="studentName" type="text" id="studentName" style="width: 100%;" value="John Doe"></td>
                                    </tr>
                                    <tr>
                                        <td>Previous Location:
                                            <br>
                                            (cmi.core.lesson_location)</td>
                                        <td>
                                            <input name="prevLoc" type="text" id="prevLoc" style="width: 100%;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Previous Bookmark:
                                            <br>
                                            (cmi.suspend_data)</td>
                                        <td>
                                            <textarea name="bookmark" rows="4" id="bookmark" style="width: 100%;"></textarea></td>
                                    </tr>
                                    <tr>
                                        <td>Previous Status:
                                            <br>
                                            (cmi.core.lesson_status)</td>
                                        <td>
                                            <input name="cStatus" type="text" id="cStatus" style="width: 100%;" value="incomplete"></td>
                                    </tr>
                                    <tr>
                                        <td>Previous Score:<br>
                                            (cmi.core.score.raw)</td>
                                        <td>
                                            <input name="lastScore" type="text" id="lastScore" style="width: 100%;"></td>
                                    </tr>
                                    <tr>
                                        <td>Lesson Mode:<br>
                                            (cmi.core.lesson_mode)</td>
                                        <td>
                                            <select name="lesson_mode" id="lesson_mode" style="width: 100%;">
                                                <option value="browse">browse</option>
                                                <option value="normal">normal</option>
                                                <option value="review">review</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>All Messages:</td>
                                        <td>
                                            <textarea class="allMessages" rows="9" style="width: 100%;"></textarea>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div class="aiccLog">
                                <textarea rows="23" class="allMessages" style="width: 100%;"></textarea>
                            </div>
                        </div>
                    </td>
                    <td align="center" style="color: <%# (bool)Eval("enabled")==true ? "green": "red" %>"><%# (bool)Eval("enabled")==true? "Yes": "No" %></td>
                    <td class="text-center">
                        <button type="button" class="btn btn-md btn-primary" onclick='openUploadEditor(<%# Eval("courseId") %>, this.parentElement.parentElement.id)'>Upload <span class="fa fa-upload"></span></button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-md btn-primary" onclick='runCourse(<%# Eval("courseId") %>, this.parentElement.parentElement.id)'>Launch <span class="fa fa-paper-plane"></span></button>
                    </td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>



    <!-- edit course modal -->
    <div id="courseEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Course Editor</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="360px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="onSave()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>


    <!-- upload package modal -->
    <div id="uploadEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Course Package Upload</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="210px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
