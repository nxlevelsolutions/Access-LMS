<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="UsersImport.aspx.cs" Inherits="NXLevel.LMS.Admin.UsersImport" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style type="text/css">
        .red{
            color:#ff0000;
        }
        td{
            padding: 4px;
        }
        .fileUpload {
            position: relative;
            overflow: hidden;
            margin: 10px;
            background-color: #9F9E9E;
            border-radius: 3px;
        }

        .fileUpload input.upload {
            position: absolute;
            top: 0;
            right: 0;
            margin: 0;
            padding: 0;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            filter: alpha(opacity=0);
        }
        .mediaUpload {
            display: inline-block; 
            width: 82% !important;
        }
        .media-progress {
            margin: 0px; 
            width: 82%;
        }
        #progress-container{
            display:none;
        }

        #message{
            color:red;
            font-weight:bolder;
        }
    </style>

    <script>

        function selectFileToUpload(ctrl) {
            //clear messages
            $('#message').html(""); 
            $('#progress-container').hide();

            if (ctrl.files.length > 0) {
                $('#txtFileToUpload').val(ctrl.files[0].name);
                $('#btnUpload').removeAttr('disabled');
            }
            else {
                $('#txtFileToUpload').val('');
                $('#btnUpload').prop('disabled', 'disabled');
                return;
            }

            if (ctrl.files[0].size < 1024000) {
                $('#lblFileInfo').html("File size: " + (ctrl.files[0].size / 1024).toFixed() + "KB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; type: " + ctrl.files[0].type);
            }
            else {
                $('#lblFileInfo').html("File size: " + ((ctrl.files[0].size / 1024) / 1024).toFixed(1) + "MB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; type:" + ctrl.files[0].type);
            }
        }

        function btnUpload_Click(fileUploadCtrl, extensions) {
            var fileCtrl = document.getElementById(fileUploadCtrl);
           
            $('#progress-container').show();
            Utils.UploadFile(fileCtrl.files[0], 'ImportUserData.ashx', {
                allowedExtensions: extensions,
                onSuccess: function (message, uploadedFile) {
                    $('#message').html("File was imported successfully.");
                    $('#progress-container').show();
                    //$('#progressIndicator').removeClass('active');
                },
                onError: function (message, file, code) {
                    $('#message').html(message); 
                    //$('#progress-container').hide();
                },
                onProgress: function (percent) {
                    console.log("%=" + percent);
                    $('#progressIndicator').css('width', (percent * 100) + '%');
                    $('#progressIndicator span').html(Math.round(percent * 100) + '% completed');
                }
            });
        }

    </script>


</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="fa fa-upload"></span> User Administration: Data file import</h3>
    </div>

    <p><b>STEP 1:</b> Make sure your Excel data contains the following columns and that your data starts in row 2 (row 1 contains labels): (<a>Download an Excel Template</a>)</p>
    <table class="table-bordered table-responsive">
        <tr>
            <td align="center"><b>Excel Column</b></td>
            <td colspan="2" ><b>Contents</b></td>
            
        </tr>
        <tr>
            <td align="center"><b>A</b></td>
            <td><input type="text" style="min-width:122px" value="Email" disabled /></td>
            <td><span class="red">Required</span> email of the learner. Ensure that all emails are unique.</td>
        </tr>
        <tr>
            <td align="center"><b>B</b></td>
            <td><input type="text" value="First name" disabled /></td>
            <td><span class="red">Required</span> first name of the learner.</td>
        </tr>
        <tr>
            <td align="center"><b>C</b></td>
            <td><input type="text" value="Last name" disabled /></td>
            <td><span class="red">Required</span> last name of the learner.</td>
        </tr>
        <tr>
            <td align="center"><b>D</b></td>
            <td><input type="text" value="Default password" disabled /></td>
            <td><span class="red">Required</span> default password:</td>
        </tr>
        <tr>
            <td align="center"><b>E</b></td>
            <td><input type="text" value="Title" disabled /></td>
            <td>Optional: title of the learner. If no information is available, leave the cells blank. Do not remove this column.</td>
        </tr>
        <tr>
            <td align="center"><b>F</b></td>
            <td><input type="text" value="Manager's email" disabled /></td>
            <td>Optional: manager's email. If no information is available, leave the cells blank. Do not remove this column.</td>
        </tr>
        <tr>
            <td align="center"><b>G</b></td>
            <td><input type="text" value="Open field 1" disabled /></td>
            <td rowspan="5">Optional: open fields 1 thru 5. These can be organizational fields, like "Division", "Region", etc.
                The names that are found in row 1 and in these corresponding columns will be imported as typed in the import file. 
                They will be known as a "Organizational Groups" later on and will be available
                to you to help you organize, assign courses, view reports, etc., and group learners.
            </td>
        </tr>
        <tr>
            <td align="center"><b>H</b></td>
            <td><input type="text" value="Open field 2" disabled /></td>
        </tr>
        <tr>
            <td align="center"><b>I</b></td>
            <td><input type="text" value="Open field 3" disabled /></td>
        </tr>
        <tr>
            <td align="center"><b>J</b></td>
            <td><input type="text" value="Open field 4" disabled /></td>
        </tr>
        <tr>
            <td align="center"><b>K</b></td>
            <td><input type="text" value="Open field 5" disabled /></td>
        </tr>
    </table>

    <p>&nbsp;</p>
    <b>STEP 2:</b> Export your Excel data to plain text: 
    <ol>
        <li>Open your data in Excel, click on "File", then "Export", then "Change File Type".</li>
        <li>Click on "Save As". This will display a dialog window. Next to "Save as type", click on the drop down list and select "Unicode Text (*.txt)".</li>
        <li>Click "Save" to save the newly created file.</li>
    </ol>
    (By default the data will be tab-delimited and Unicode-encoded).
    
    
    <p>&nbsp;</p>
    <p><b>STEP 3:</b> Upload the data exported in step 2</p>

    <div class="panel panel-primary">
        <div class="panel-body">

            <div id="message"></div>

            <div id="lblFileInfo"></div>

            <input type="text" id="txtFileToUpload" placeholder="Choose File" class="form-control mediaUpload" readonly="readonly" />
            <div class="fileUpload btn btn-primary btn-sm">
                <span>BROWSE</span>
                <input type="file" id="dataFile" class="upload" onchange="selectFileToUpload(this);" />
            </div>
            <input id="btnUpload" type="button" value="UPLOAD" class="btn btn-primary btn-sm" onclick="btnUpload_Click('dataFile', '.txt,.csv')" disabled="disabled" />  
    
            <!-- progress indicator !-->
            <div id="progress-container">Progress:
                <div class="media-progress">
                    <div id="progressIndicator" class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                        <span></span>
                    </div>
                </div>
            </div>
 
     
        </div>
    </div>

    <p>&nbsp;</p>

</asp:Content>
