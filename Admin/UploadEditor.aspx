﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="UploadEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.UploadEditor" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        input[type=text] {
            width: 100%;
        }

        .fileUpload {
            position: relative;
            overflow: hidden;
            margin: 10px;
            border-radius: 5px;
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
            display: inline-block;
            width: 73%;
        }
        #msg{
            color:red;
        }
    </style>
    <script>

        var courseId = Utils.getQueryVariable("cid");

        function selectZipFileUpload(ctrl) {
            $('#msg').html("");
            if (ctrl.files.length > 0) {
                $('#btnZipFileUpload').attr('disabled', false);
            }
            else {
                $('#txtZipFileUpload').val('');
                $('#btnZipFileUpload').attr('disabled', true);
                return false;
            }

            /// current file size limit is set to 250MB
            if (ctrl.files[0].size > 250000000) {
                $('#msg').html("File exceeds maximum upload size.");
                $('#btnZipFileUpload').attr('disabled', 'disabled');
                return;
            }
            else {
                $('#btnZipFileUpload').removeAttr('disabled');
            }

            if (ctrl.files[0].size < 1024000) {
                $('#txtZipFileUpload').val(ctrl.files[0].name + ' (' + (ctrl.files[0].size / 1024).toFixed() + 'KB)');
            }
            else {
                $('#txtZipFileUpload').val(ctrl.files[0].name + ' (' + ((ctrl.files[0].size / 1024) / 1024).toFixed(1) + 'MB)');
            }
        }

        function btnUpload_Click(extensions) {
            var fileCtrl = document.getElementById("fileUploadCtrl");
           
            $('#zip-file-progress-container').show();
            $('#zipfileprogressIndicator').addClass('active'); //starts animation

            var options = {
                allowedExtensions: extensions,
                addFormData: {courseId: courseId, type: $('#packageType').html()}, 
                onSuccess: function (message, uploadedFile, res) {
                    //show error if any
                    if (res.error) {
                        $('#msg').html(res.error);
                    }
                    else {
                        $('#msg').html(uploadedFile.name + " uploaded.");
                    }

                    //render data
                    $('#tbTitle').val(res.data.title);
                    $('#tbDescription').val(res.data.description);
                    $('#tbUrl').val(res.data.startPage);
                    //reset controls
                    document.getElementById('fileUploadCtrl').value = "";
                    $('#zipfileprogressIndicator').removeClass('active');//stops animation
                    $('#txtZipFileUpload').val('');
                    $('#btnZipFileUpload').attr('disabled', true);
                },
                onError: function (message, file, code) {
                    if (message) { 
                        $('#msg').html(message);
                    }
                    //$('#zip-file-progress-container').hide();
                    document.getElementById('fileUploadCtrl').value = "";
                    $('#zipfileprogressIndicator').removeClass('active');//stops animation
                    $('#txtZipFileUpload').val('');
                    $('#btnZipFileUpload').attr('disabled', true);
                },
                onProgress: function (percent) {
                    $('#zipfileprogressIndicator').css('width', (percent * 100) + '%');
                    $('#zipfileprogressIndicator span').html(Math.round(percent * 100) + '% completed');
                }
            }

            Utils.UploadFile(fileCtrl.files[0], 'importCourse.ashx', options);
             
        }
 
         $(document).ready(function () {
             $('#packageType').html($('#rblType_0').prop('checked') ? "SCORM" : $('#rblType_1').prop('checked') ? "AICC" : "");
        });

    </script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <table class="table table-condensed">
 
        <tr>
            <td width="50">Type:</td>
            <td>
                <asp:RadioButtonList ID="rblType" runat="server" ClientIDMode="Static" >
                    <asp:ListItem Value="0" Text="SCORM 1.2" Selected="True" onchange="$('#packageType').html('SCORM')"></asp:ListItem>
                    <asp:ListItem Value="1" Text="AICC" onchange="$('#packageType').html('AICC')"></asp:ListItem>
                </asp:RadioButtonList>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                Upload <span id="packageType">SCORM</span> course package: <span id="msg"></span>
                <input type="text" id="txtZipFileUpload" name="txtZipFileUpload" placeholder="Browse for ZIP file" class="form-control mediaUpload" readonly="true" />
                <div class="fileUpload btn btn-primary btn-md">
                    <span>Browse</span>
                    <input type="file" id="fileUploadCtrl" class="upload" onchange="selectZipFileUpload(this);" />
                </div>
                <input id="btnZipFileUpload" type="button" value="Upload" class="btn btn-primary btn-md" style="border: 1px solid #9F9E9E;" onclick="btnUpload_Click('.zip')" disabled="disabled" /><br />

                <div id="zip-file-progress-container" class="media-progress-container collapse">
                    <span id="lblZipFileInfo"></span>
                    <div class="progress media-progress">
                        <div id="zipfileprogressIndicator" class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span></span></div>
                    </div>
                </div>

            </td>
        </tr>
    </table>

</asp:Content>