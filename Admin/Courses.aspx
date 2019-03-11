<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Courses.aspx.cs" Inherits="NXLevel.LMS.Admin.Courses" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
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
            $('#courseEditor iframe').attr('src', 'CourseEditor.aspx' + (courseId == null ? '' : '?cid=' + courseId));
            $('#courseEditor #saveBtn').prop("disabled", false);
            $('#courseEditor').modal({ show: true });
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

        var API = function () {
            var cont;

            function setStatus(msg) {
                var txt = $(this.containerId + ' .scormLog .allMessages').val();
                txt += msg + '\r';
                $(this.containerId + ' .scormLog .allMessages').val(txt);
            }

            return {
                Start: function (containerId) {
                    this.containerId = containerId;
                    cont = $(this.containerId + ' .scormLog');
                    cont.find('#cStatus').val("");
                    cont.find('#prevLoc').val("");
                    cont.find('#bookmark').val("");
                    cont.find('#lastScore').val("");
                },
                LMSInitialize: function () {
                    return "true";
                },
                LMSSetValue: function (key, value) {
                    switch (key) {
                        case "cmi.core.lesson_status":
                            cont.find('#cStatus').val(value);
                            break;
                        case "cmi.core.lesson_location":
                            cont.find('#prevLoc').val(value);
                            break;
                        case "cmi.suspend_data":
                            cont.find('#bookmark').val(value);
                            break;
                        case "cmi.core.score.raw":
                            cont.find('#lastScore').val(value);
                            break;
                    }
                    setStatus("key=" + key + " set to:\"" + value + "\"");
                    return "true";
                },
                LMSGetValue: function (key) {
                    setStatus("get value of key=" + key);
                    switch (key) {
                        case "cmi.core.lesson_status":
                            ret = cont.find('#cStatus').val();
                            break;
                        case "cmi.core.lesson_location":
                            ret = cont.find('#prevLoc').val();
                            break;
                        case "cmi.suspend_data":
                            ret = cont.find('#bookmark').val();
                            break;
                        case "cmi.core.student_name":
                            ret = cont.find('#studentName').val();
                            break;
                        case "cmi.core.lesson_mode":
                            ret = cont.find('#lesson_mode').val();
                            break;
                        case "cmi.core.score.raw":
                            ret = cont.find('#lastScore').val();
                            break;
                        default:
                            setStatus("Key \"" + key + "\" not implemented.");
                            ret = null;
                    }
                    if (ret == null) ret = "";
                    setStatus("returned value=\"" + ret + "\"");
                    return ret;
                },
                LMSCommit: function () {
                    Utils.log("LMSCommit called");
                    return "true";
                },
                LMSFinish: function () {
                    Utils.log("LMSFinish called");
                    return "";
                },
                LMSGetLastError: function () {
                    return "";
                },
                LMSGetErrorString: function (code) {
                    return "";
                },
                LMSGetDiagnostic: function () {
                    return "";
                }
            }

        }();

        var AICC = function () {
            var pubObj = {
                containerId: undefined,
                Start: function (contId) {
                    this.containerId = contId;
                    resetStart();
                },
                Reset: function () {

                }
            };
            function resetStart() {
                $.ajax({
                    url: "aicc.asp",
                    type: 'post',
                    async: false,
                    data: { command: 'killsession'},
                    success: function (ret) {
                        refreshPage();
                    }
                });
            }
            function getSessionData() {
                $.ajax({
                    url: "aicc.asp",
                    type: 'post',
                    async: false,
                    data: { command: 'getparam', w: 1 },
                    success: function (ret) {
                        $(pubObj.containerId + ' .aiccLog .allMessages').val(ret);
                    }
                });
            }
            function refreshPage(){
	            getSessionData();
	            if (pubObj.containerId) setTimeout(refreshPage, 1500);
            }
            return pubObj;
        }();


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
                        ",status=" + (data.status ? "yes" : "no") +
                        ",resizable=" + (data.resizable ? "yes" : "no") +
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
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="fa fa-book"></span> Courses</h3>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <button type="button" class="btn btn-md btn-primary" onclick='openCourseEditor(null)'><span class="fa fa-plus"></span> NEW COURSE</button>
        </div>
        <asp:Repeater ID="rptCourseList" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor" id="usersList">
                    <tr>
                        <th>Title</th>
                        <th class="text-center">Enabled</th>
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
                        <button type="button" class="btn btn-md btn-primary" onclick='runCourse(<%# Eval("courseId") %>, this.parentElement.parentElement.id)'>Launch <span class="fa fa-paper-plane"></span></button>
                    </td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>



    <!-- edit user modal -->
    <div id="courseEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 id="addAdminLabel" class="modal-title text-center">Course Editor</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="560px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="onSave()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
