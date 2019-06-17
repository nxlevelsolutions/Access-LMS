<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Courses.aspx.cs" Inherits="NXLevel.LMS.Admin.Courses" %>
<%@ Import Namespace="NXLevel.LMS" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="../js/demo_AICC.js"></script>
    <script src="../js/demo_SCORM.js"></script>
    <style type="text/css">
        .logPanel {
            width: 100%;
            height: 400px;
            border: 1px solid lightgray;
            background-color: aliceblue;
            border-radius: 4px;
            padding: 10px;
            display: none;
        }
        .updatePanel{
            width: 100%;
            border: 1px solid lightgray;
            background-color: aliceblue;
            border-radius: 4px;
            padding: 0px;
            display: none;
        }
        .courseInfo{
            float: left;
            width: 49%;
            border: 1px solid lightgray;
            background-color: #fff;
            border-radius: 4px;
            padding: 10px;
            margin:10px;
        }
        .uploadInfo{
            margin-left: 51%;
            margin-top: 10px;
            height: 100%;
        }

        .scormLog, .aiccLog, .updatePanel{
            font-family: 'Courier New';
            font-size: 11px;
            
        }

            .scormLog tr {
                background-color: unset !important;
            }

    .italize{
        font-style:italic;
    }

        .fileUpload {
            position: relative;
            overflow: hidden;
            margin: 10px 10px 0px 0px;
            border-radius: 5px;
            font-size: 12px;
        }
            .fileUpload input.upload {
                position: absolute;
                top: 0;
                right: 0;
                width: 72px;
                margin: 0;
                padding: 0;
                font-size: 20px;
                cursor: pointer;
                opacity: 0;
                filter: alpha(opacity=0);
            }

        .mediaUpload {
            font-size: 12px;
            display: inline-block;
            width: 73%;
        }
        #btnZipFileUpload{
            margin-top: 10px;
        }
        #msg{
            color:red;
            font-weight: bolder;
        }
        /* override 100% temporarily*/
        input[type='text'], textarea {
            width: 95%;
        }
    </style>
    <script language="javascript">
 	
        var courseId,
            courseCont; //course container - entire td block

        function toggleCourseEditor(_courseId) {
            courseCont = $('#cont' + _courseId);
            if (courseCont.find('.updatePanel').is(':visible')) {
                courseCont.find(".updatePanel").hide('blind', {}, 700)
            }
            else {
                //check course type
                enableReadAndSign(courseCont.find("input[name^='cType']:checked").val() == "<% =(int)CourseType.READ_AND_SIGN %>");

                //open panel
                $(".logPanel").hide('blind', {}, 1000)
                $('.updatePanel').hide('blind', {}, 1000) //close all
                courseCont.find(".updatePanel").show("blind", {}, 1000).css("display", "inline-block");;
            }
            courseId = _courseId;
        }

        function runCourse(courseId, BtnLaunch, skipReset) {

            var containerId = '#' + BtnLaunch.parentElement.parentElement.id;
            $(".logPanel").hide(); 
            $(".scormLog").hide();
            $(".aiccLog").hide();
            $('#cont' + courseId).find(".updatePanel").hide("blind", {}, 1000);

            $.ajax({
                type: "GET",
                url: "LmsMessage.ashx?m=COURSE_LAUNCH_PARAMS&uid=0&cid=" + courseId + "&r=" + Math.random(),
                async: true,
                success: function (data) {
                    // show scorm log
                    if (data.type == <% =(int)CourseType.SCORM %>) {
                        if (API.containerId!=containerId) {
                            API.Start(containerId);    
                        }
                        $(containerId + " .scormLog").show();
                        $(containerId + " .logPanel").show("blind", {}, 1000);
                    }
                    // show aicc log
                    if (data.type == <% =(int)CourseType.AICC %>) {
                        if (AICC.containerId != containerId) {
                            if (skipReset!==true) AICC.Start(containerId + ' .aiccLog .allMessages');
                        }
                        $(containerId + " .aiccLog").show();
                        $(containerId + " .logPanel").show("blind", {}, 1000);
                    }
                    // show read and sign popup
                    if (data.type == <% =(int)CourseType.READ_AND_SIGN %>) {
                        $('#pnReadAndSign h3').html(data.title);//set popup title
                        $('#pnReadAndSign iframe').attr('src', '../courses/ReadAndSign.aspx?cid=' + courseId);
                        $('#pnReadAndSign').modal({ show: true });
                    }
                    else {
                        // load data.url straight up
                        var modWin = window.open("../" + data.url + (data.type == <% =(int)CourseType.AICC %> ? "?AICC_SID=123&AICC_URL=<%= ResolveUrl("~/admin/aicc.asp") %>" : ""),
                            "previewWindow", "dependent,menubar=no,scrollbars=no" +
                            ",width=" + data.width +
                            ",height=" + data.height);
                        //modWin.opener = window;
                        if (modWin) {
                            modWin.focus();
                            if (data.type == <% =(int)CourseType.AICC %>) AICC.courseWindow = modWin;
                        }
                        else {
                            alert("A popup blocker has been detected in your browser. \nIn order to run this course, you need to disable any pop-up blockers running on your machine.");
                        }
                    }
                },
                error: function (xhr, ajaxOptions, err) {
                    Utils.log("Review setMessage ERROR: '" + ajaxOptions + "':" + err.message);
                }
            });
        }

        //------------------------------------
        // upload functions
        //------------------------------------
        function selectZipFileUpload(ctrl) {
            courseCont.find('#msg').html("");
            if (ctrl.files.length == 0) {
                courseCont.find('#txtZipFileUpload').val('');
                courseCont.find('#btnZipFileUpload').attr('disabled', true);
                return false;
            }

            /// current file size limit is set to 250MB
            if (ctrl.files[0].size > 250000000) {
                courseCont.find('#msg').html("File exceeds maximum upload size.");
                courseCont.find('#btnZipFileUpload').attr('disabled', true);
                return;
            }
            else {
                courseCont.find('#zipfileprogressIndicator').css('width', '0%');
                courseCont.find('#btnZipFileUpload').removeAttr('disabled');
            }

            if (ctrl.files[0].size < 1024000) {
                courseCont.find('#txtZipFileUpload').val(ctrl.files[0].name + ' (' + (ctrl.files[0].size / 1024).toFixed() + 'KB)');
            }
            else {
                courseCont.find('#txtZipFileUpload').val(ctrl.files[0].name + ' (' + ((ctrl.files[0].size / 1024) / 1024).toFixed(1) + 'MB)');
            }
        }

        function btnUpload_Click() {
            var fileCtrl = courseCont.find("#fileUploadCtrl"),
                courseType = courseCont.find("input[name^='cType']:checked").val(),
                extensions = courseType ==<% =(int)CourseType.READ_AND_SIGN %> ? '': '.zip',
                msg = courseCont.find('#msg');

            courseCont.find('#zip-file-progress-container').show();
            courseCont.find('#zipfileprogressIndicator').addClass('active'); //starts animation

            var options = {
                allowedExtensions: extensions,
                addFormData: {
                    courseId: courseId,
                    type: courseType
                },
                onSuccess: function (message, uploadedFile, res) {
                    //show error if any
                    if (res.error) {
                        msg.html("ERROR: " + res.error);
                    }
                    else {
                        //msg.html(uploadedFile.name + " uploaded.");
                        msg.html("Success! The course package was installed.");
                    }

                    //render data
                    if (courseType ==<% =(int)CourseType.READ_AND_SIGN %>) {
                        courseCont.find('#tbUrl').val(uploadedFile);
                    }
                    else {
                        courseCont.find('#tbTitle').val(res.data.title);
                        courseCont.find('#tbDescription').val(res.data.description);
                        courseCont.find('#tbUrl').val(res.data.startPage);
                    }

                    //reset controls
                    fileCtrl.val("");
                    courseCont.find('#zipfileprogressIndicator').removeClass('active');//stops animation
                    courseCont.find('#txtZipFileUpload').val('');
                    courseCont.find('#btnZipFileUpload').attr('disabled', true);
                },
                onError: function (message, file, code) {
                    if (message) {
                        msg.html(message);
                    }
                    fileCtrl.val("");
                    courseCont.find('#zipfileprogressIndicator').removeClass('active');//stops animation
                    courseCont.find('#txtZipFileUpload').val('');
                    courseCont.find('#btnZipFileUpload').attr('disabled', true);
                },
                onProgress: function (percent) {
                    courseCont.find('#zipfileprogressIndicator').css('width', (percent * 100) + '%');
                    courseCont.find('#zipfileprogressIndicator span').html(Math.round(percent * 100) + '% uploaded');
                }
            }

            msg.html("Working... Please wait.");
            Utils.UploadFile(fileCtrl[0].files[0], 'importCourse.ashx', options);

        }

        function saveCourseInfo() {
            Utils.Post("Courses.aspx/Save",
                {
                    courseId: courseId,
                    type: courseCont.find("input[name^='cType']:checked").val(),
                    title: courseCont.find('#tbTitle').val(),
                    description: courseCont.find('#tbDescription').val(),
                    enabled: courseCont.find('#cbEnabled').prop("checked"),
                    startPage: courseCont.find('#tbUrl').val(),
                    width: courseCont.find('#tbWidth').val(),
                    height: courseCont.find('#tbHeight').val(), 
                    extra1: courseCont.find('#tbInstructions').val(), 
                    extra2: courseCont.find('#tbButtonLabel').val() 
                },
                function (response) {
                    if (response.error) {
                        msg.html(response.error);
                    }
                    else {
                        document.location.href = Utils.setQueryVariable({ e: null }); //remove "e"dit key
                    }
                }
            );
        }


        //------------------------------------
        // delete functions
        //------------------------------------
        function confirmDelete(cId) {
            $('#deleteConfirmation').
                data("cId", cId).
                modal({ show: true });
        }
        function deleteItem() {
            Utils.Post("Courses.aspx/Delete",
                {
                    courseId: $('#deleteConfirmation').data("cId")
                },
                function (response) {
                    if (response.error) {
                        Utils.ConsoleWrite(response.error);
                    }
                    else {
                        //window.location.reload();
                        document.location.href = Utils.setQueryVariable({ e: null });
                    }
                }
            );
        }

        // misc
        function enableLaunch(txtBox) {
            var containerId = '#' + txtBox.parentElement.parentElement.parentElement.parentElement.id;
            if (txtBox.value == "") {
                $(containerId + " #btnLaunch").prop("disabled", true);
            }
            else {
                $(containerId + " #btnLaunch").removeAttr("disabled");
            }
        }

        function enableReadAndSign(viewReadSign) {
            if (viewReadSign) {
                courseCont.find('#pnCourseInfo').hide();
                courseCont.find('#pnReadSignInfo').show();
                courseCont.find('#lblUploadLabel').html("Upload asset file:");
            }
            else {
                courseCont.find('#pnCourseInfo').show();
                courseCont.find('#pnReadSignInfo').hide();
                courseCont.find('#lblUploadLabel').html("Upload course package:");
            }
        }

        $(document).ready(function () {
            $("#deleteConfirmation").draggable({ handle: ".modal-header" });
            $("#pnReadAndSign").draggable({ handle: ".modal-header" });
        });

        $(window).load(function () {
            courseId = Utils.getQueryVariable("e"); // edit course id
            if (courseId) {
                courseCont = $('#cont' + courseId);
                courseCont.find(".updatePanel").show("blind", {}, 1000).css("display", "inline-block");
                enableReadAndSign(courseCont.find("input[name^='cType']:checked").val() == "<% =(int)CourseType.READ_AND_SIGN %>");
            }
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="fa fa-book"></span> Courses</h3>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <button type="button" ID="BtnNewCourse" runat="server" class="btn btn-md btn-primary" onserverclick="BtnNewCourse_Click" ><span class='fa fa-plus'></span> NEW COURSE</button>
        </div>
        <asp:Repeater ID="rptCourseList" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor" id="usersList">
                    <tr>
                        <th>Title</th>
                        <th class="text-center" width="110">Enabled</th>
                        <th class="text-center" width="110">Type</th>
                        <th class="text-center" width="110">Preview</th>
                        <th class="text-center" width="70"></th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr id="cont<%# Eval("courseId") %>">
                    <td>
                        <a class='<%# (Eval("title")==null || (string)Eval("title")=="") ? "italize": "" %>' onclick='toggleCourseEditor(<%# Eval("courseId") %>)'><%# (Eval("title")==null || (string)Eval("title")=="") ? "Title goes here": Eval("title") %></a>

                        <div class="updatePanel">
                            <span class="glyphicon glyphicon-chevron-up close" style="margin: 6px;" onclick="$('.updatePanel').hide('blind', {}, 1000)"></span>
                            <div class="courseInfo">
                                <!-- course info section !-->
                                Title:<br />
                                <input ID="tbTitle" type="text" value="<%# Server.HtmlEncode((string)Eval("title")) %>" /><br />
                                Description:<br />
                                <textarea id="tbDescription" rows="4" cols="20" ><%# Eval("description") %></textarea>
                                Enabled: <asp:CheckBox ID="cbEnabled" runat="server" ClientIDMode="Static" Checked='<%# (bool)Eval("enabled")==true %>' /><br />
                                <div id="pnCourseInfo">
                                    Start page: <br />
                                    <input ID="tbUrl" type="text" value='<%# StripRoot(Eval("url"), Eval("courseId")) %>' onkeyup="enableLaunch(this)" /><br />
                                </div>
                                <div id="pnReadSignInfo">
                                    Instructions: <br />
                                    <textarea id="tbInstructions" rows="2" cols="20" ><%# Eval("extra1") %></textarea>
                                    Button label: <br />
                                    <input ID="tbButtonLabel" type="text" value='<%# Server.HtmlEncode((string)Eval("extra2")) %>' /><br />
                                </div>
                                Initial course window size (optional):<br />
                                <input type="text" id="tbWidth" style="width:40px" value='<%# Eval("browserWidth") %>' /> (width) x
                                <input type="text" id="tbHeight" style="width:40px" value='<%# Eval("browserHeight") %>' /> (height) <br />
                                <hr />
                                <input type="button" value="Save" class="btn btn-primary btn-sm" onclick="this.enabled = false;saveCourseInfo()" />
                            </div>
                            <div class="uploadInfo">
                                <!-- course upload section !-->
                                Type: 
                                <input id="rblType_<%# Eval("courseId") %>1" type="radio" <%# (short)Eval("type")==1 ? "checked": "" %> name="cType<%# Eval("courseId") %>" value="1" onchange="enableReadAndSign(false)" /><label for="rblType_<%# Eval("courseId") %>1">SCORM 1.2</label>&nbsp;&nbsp;
                                <input id="rblType_<%# Eval("courseId") %>2" type="radio" <%# (short)Eval("type")==2 ? "checked": "" %> name="cType<%# Eval("courseId") %>" value="2" onchange="enableReadAndSign(false)" /><label for="rblType_<%# Eval("courseId") %>2">AICC</label>&nbsp;&nbsp;
                                <input id="rblType_<%# Eval("courseId") %>3" type="radio" <%# (short)Eval("type")==3 ? "checked": "" %> name="cType<%# Eval("courseId") %>" value="3" onchange="enableReadAndSign(true)" /><label for="rblType_<%# Eval("courseId") %>3">READ AND SIGN</label>
                                <br />
                                <br />
                                <span id="lblUploadLabel"></span>  
                                <input type="text" id="txtZipFileUpload" name="txtZipFileUpload" placeholder="Click Browse to select" class="form-control mediaUpload" readonly="true" />
                                <div class="fileUpload btn btn-primary btn-md">
                                    <span>Browse</span>
                                    <input type="file" id="fileUploadCtrl" class="upload" onchange="selectZipFileUpload(this);" />
                                </div>
                                <input id="btnZipFileUpload" type="button" value="Upload" class="btn btn-primary btn-sm" style="border: 1px solid #9F9E9E;" onclick="btnUpload_Click()" disabled="disabled" /><br />

                                <div id="zip-file-progress-container" class="media-progress-container collapse">
                                    <span id="lblZipFileInfo"></span>
                                    <div class="progress media-progress">
                                        <div id="zipfileprogressIndicator" class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span></span></div>
                                    </div>
                                </div>

                                <br />
                                <p id="msg"></p>
                                <p style="color:#ccc; font-style:italic">Created on <%# Eval("timestamp", "{0:MM/dd/yyyy hh:mm tt}") %></p>
                            </div>
                        </div>

                        <div class="logPanel">
                            <b>Course Log:</b> <span class="glyphicon glyphicon-chevron-up close" onclick="$('.logPanel').hide('blind', {}, 1000)"></span>
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
                                <textarea rows="21" class="allMessages" style="width: 100%;"></textarea>
                                <input type="button" value="Resume" class="btn btn-primary btn-sm" onclick="runCourse(<%# Eval("courseId") %>, this.parentElement.parentElement, true)" />
                            </div>
                        </div>
                    </td>
                    <td align="center" style="color: <%# (bool)Eval("enabled")==true ? "green": "red" %>"><%# (bool)Eval("enabled")==true? "Yes": "No" %></td>
                    <td align="center"><%# TypeName(Eval("type")) %></td>
                    <td class="text-center">
                        <button id="btnLaunch" type="button" class='btn btn-md btn-primary' <%# (short)Eval("type")!=(short)CourseType.READ_AND_SIGN && (Eval("url")==null || Eval("url").ToString().EndsWith("/")) ? "disabled": "" %> onclick='runCourse(<%# Eval("courseId") %>, this)'>Launch <span class="fa fa-paper-plane"></span></button>
                    </td>
                    <td class="text-center">
                        <button type="button" class="btn btn-md btn-primary btn-warning" <%# (bool)Eval("inUse") ? "disabled": "" %> title='<%# (bool)Eval("inUse") ? "This course cannot be deleted. It is being or has been used.": "Click to delete" %>'  onclick="confirmDelete(<%# Eval("courseId") %>)"><span class="fa fa-trash"></span></button>
                    </td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>


    <!-- delete course modal -->
    <div id="deleteConfirmation" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Delete Confirmation</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <table width="90%" align="center">
                            <tr>
                                <td >
                                    <p align="center">Deleting this course will also delete its corresponding files from the server.
                                    </p>
                                    <p align="center">Are you sure you want to delete this item?</p>
                                    <p align="center">Please click OK to confirm</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="deleteItem()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>


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
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
