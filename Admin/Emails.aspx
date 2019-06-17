<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Emails.aspx.cs" Inherits="NXLevel.LMS.Admin.Emails" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style type="text/css">
        .modal-dialog{
            width: 700px;
        }
    </style>
        <script language="javascript">
        var popName;

        function openEditor(emailId) {
            popName = "emailEditor";
            $('#emailEditor iframe').attr('src', 'EmailEditor.aspx?emailId=' + emailId);
            $('#emailEditor #saveBtn').prop("disabled", false);
            $('#emailEditor').modal({ show: true });
        }

        function onSave() {
            $('#' + popName + ' #saveBtn').prop("disabled", true);
            $('#' + popName + ' iframe')[0].contentWindow.onSave();
        }

        function closeWin(refresh) {
            $('#' + popName).modal("hide");
        }

        $(document).ready(function () {
            $("#userEditor").draggable({ handle: ".modal-header" });
        });

    </script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

<%--All are optional
Assigned activity
Periodic reminder every X days
Reminder X days before due date
Reminder on due date
Overdue assignment
All should have option to include Manager
Includes link to activity/curriculum--%>


    <div class="page-header">
        <h3><span class="glyphicon glyphicon-envelope"></span> Email Notifications</h3>
    </div>

    <table class="table-responsive" style="width: 75%; margin-left: 25px;">
        <tr>
            <td width="30" align="center"><span class="fa fa-envelope"></span></td>
            <td><b><a onclick="openEditor(1)">ASSIGNED ACTIVITY REMINDER</a></b></td>
        </tr>
        <tr>
            <td></td>
            <td>This email is delivered to assigned learner when the activity is started.</td>
        </tr>
        <tr>
            <td></td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td align="center"><span class="fa fa-envelope"></span></td>
            <td><b><a onclick="openEditor(2)">PERIODIC REMINDER</a></b></td>
        </tr>
        <tr>
            <td></td>
            <td>Periodic reminders are sent every X days if the learner has not yet completed the asssignment. The value for X is set so you can pace the delivery of this email according to your organizations rules.</td>
        </tr>
        <tr>
            <td></td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td width="30" align="center"><span class="fa fa-envelope"></span></td>
            <td><b><a onclick="openEditor(3)">NEAR DUE DATE REMINDER</a></b></td>
        </tr>
        <tr>
            <td></td>
            <td>This reminder is sent X days before the assiggnment is due if the learner has not yet completed the assignment. The value for X is set so you can pace the delivery of this email according to your organizations rules.</td>
        </tr>
        <tr>
            <td></td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td align="center"><span class="fa fa-envelope"></span></td>
            <td><b><a onclick="openEditor(4)">ON DUE DATE REMINDER</a></b></td>
        </tr>
        <tr>
            <td></td>
            <td>This reminder is sent on the day an assignment is due if the learner has not yet completed the assignment.</td>
        </tr>
        <tr>
            <td></td>
            <td>&nbsp;</td>
        </tr>
        <tr>
            <td align="center"><span class="fa fa-envelope"></span></td>
            <td><b><a onclick="openEditor(5)">OVERDUE REMINDER</a></b></td>
        </tr>
        <tr>
            <td></td>
            <td>This reminder is sent X days after the assiggnment is due if the learner has not yet completed the assignment. The value for X is set so you can pace the delivery of this email according to your organizations rules.</td>
        </tr>
    </table>



        <!-- edit email modal -->
    <div id="emailEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 id="addAdminLabel" class="modal-title text-center">Email Editor</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="550px"></iframe>
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
