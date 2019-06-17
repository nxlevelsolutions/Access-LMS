<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="AssignmentSettings2.aspx.cs" Inherits="NXLevel.LMS.Admin.AssignmentSettings2" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        #tbRegisterCode {
            text-transform: uppercase;
            font-family: monospace;
            font-size: 14px;
        }
    </style>
    <script>
        function onSave() {

            //check title
            if ($('#txtTitle').val() == '') {
                $("#errMessage").html("The 'Name' field is required.");
                return;
            }

            //check periodic reminders
            if ($('#cbEmailPeriodic').prop('checked') && $('#txtPeriodicDays').val() == "") {
                $("#errMessage").html("The 'Send periodic reminders' option was checked, but no days were specified.");
                return;
            }

            //check overdue reminders
            if ($('#cbEmailOverdue').prop('checked') && $('#txtOverdueDays').val() == "") {
                $("#errMessage").html("The 'Send overdue reminder' option was checked, but no days were specified.");
                return;
            }

            if ($('#cbEmailNearDueDate').prop('checked') && $('#txtNearDueDateDays').val() == "") {
                $("#errMessage").html("The 'Send near due date' option was checked, but no days were specified.");
                return;
            }

            parent.window.disableOK();
            Utils.Post("AssignmentSettings2.aspx/Save",
                {
                    title: $('#txtTitle').val(),
                    description: $('#txtDescription').val(),
                    enabled: $('#cbEnabled').prop('checked'),
                    registerCode: $('#tbRegisterCode').val(),
                    dueDate: $('#txtDueDate').val().trim() === "" ? null : $('#txtDueDate').val(),
                    dueDays: $('#txtDueDays').val().trim() === "" ? null : $('#txtDueDays').val(),
                    emailOnAssigned: $('#cbEmailOnAssigned').prop('checked'),
                    emailPeriodic: $('#cbEmailPeriodic').prop('checked'),
                    periodicDays: $('#txtPeriodicDays').val().trim() == "" ? null : $('#txtPeriodicDays').val(),
                    emailNearDueDate: $('#cbEmailNearDueDate').prop('checked'),
                    nearDueDateDays: $('#txtNearDueDateDays').val() == "" ? null : $('#txtNearDueDateDays').val(),
                    emailOnDueDate: $('#cbEmailDueDate').prop('checked'),
                    emailOverdue: $('#cbEmailOverdue').prop('checked'),
                    overdueDays: $('#txtOverdueDays').val().trim() == "" ? null : $('#txtOverdueDays').val()
                },
                function (response) {
                    if (response.error == "") {
                        parent.window.closeWin(true, '#tab2');
                    }
                    else {
                        parent.window.disableOK(false);
                        $("#errMessage").html(response.error);
                    }
                }
            );
            
        }

        //function enableRegCode(ctrl) {
        //    $('#tbRegisterCode').prop('disabled', !ctrl.checked);
        //    if (ctrl.checked) {
        //        $('#tbRegisterCode').prop('placeholder', "Enter registration code");
        //        $('#tbRegisterCode').focus();
        //    }
        //    else {
        //        $('#tbRegisterCode').val("");
        //        $('#tbRegisterCode').prop('placeholder', "");
        //    }
        //}

        function enablePeriodicDays(ctrl) {
            $('#txtPeriodicDays').prop('disabled', !ctrl.checked);
            if (ctrl.checked) {
                $('#txtPeriodicDays').focus();
            }
            else {
                $('#txtPeriodicDays').val("");
            }
        }

        function enableOverdueDays(ctrl) {
            $('#txtOverdueDays').prop('disabled', !ctrl.checked);
            if (ctrl.checked) {
                $('#txtOverdueDays').focus();
            }
            else {
                $('#txtOverdueDays').val("");
            }
        }

        function enableNearDueDays(ctrl) {
            $('#txtNearDueDateDays').prop('disabled', !ctrl.checked);
            if (ctrl.checked) {
                $('#txtNearDueDateDays').focus();
            }
            else {
                $('#txtNearDueDateDays').val("");
            }
        }

        function checkDueSettings(flag) {
            var dueDate = document.getElementById('txtDueDate'),
                dueDays = document.getElementById('txtDueDays');
            if (flag === true) dueDays.value = "";
            if (flag === false) dueDate.value = "";

            if (isNaN(Date.parse(dueDate.value)) && dueDays.value.trim() === '') {
                $('#cbEmailNearDueDate').prop('disabled', true); $('#cbEmailNearDueDate').prop('checked', false);
                $('#cbEmailDueDate').prop('disabled', true); $('#cbEmailDueDate').prop('checked', false);
                $('#cbEmailOverdue').prop('disabled', true); $('#cbEmailOverdue').prop('checked', false);
                $('#txtNearDueDateDays').prop('disabled', true); $('#txtNearDueDateDays').val("");
                $('#txtOverdueDays').prop('disabled', true); $('#txtOverdueDays').val("");
            }
            else {
                $('#cbEmailNearDueDate').prop('disabled', false);
                $('#cbEmailDueDate').prop('disabled', false);
                $('#cbEmailOverdue').prop('disabled', false);
            }
        }

        $(document).ready(function () {
            $("#txtDueDate").datepicker();
            $('#txtPeriodicDays').prop('disabled', !$('#cbEmailPeriodic').prop("checked"));
            $('#txtNearDueDateDays').prop('disabled', !$('#cbEmailNearDueDate').prop("checked"));
            $('#txtOverdueDays').prop('disabled', !$('#cbEmailOverdue').prop("checked"));
            $('[data-toggle="tooltip"]').tooltip();
            checkDueSettings();
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div id="errMessage" class="required-red"></div>
   
    <table width="100%">
        <tr>
            <td width="100" height="33" valign="top">Name: <div class="asterisk required-red"></div></td>
            <td><asp:TextBox ID="txtTitle" runat="server" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
        <tr>
            <td valign="top">Description:</td>
            <td><asp:TextBox ID="txtDescription" runat="server" TextMode="MultiLine" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
    </table>


    <table class="table">
        <tr>
            <td>
                <asp:CheckBox runat="server" ID="cbEnabled" Text="Enable this Learning Plan" ClientIDMode="Static" 
                    data-toggle="tooltip" 
                    data-placement="right" 
                    title="Checking this box will make this Learning Plan's course(s) available to the assigned users immediately." /> 
            </td>
        </tr>
        <tr>
            <td>
                <p>Registration code to use in self-registration page:</p>
                <asp:TextBox runat="server" ID="tbRegisterCode"  ClientIDMode="Static"
                    data-toggle="tooltip" 
                    data-placement="bottom" 
                    title="When this registration code is entered by registering users, this Learning Plan's course(s) will be automatically assigned to them."></asp:TextBox> 
            </td>
        </tr>
        <tr>
            <td>
                <asp:CheckBox runat="server" ID="cbEmailOnAssigned" Text='Send "Assigned activity" reminder email' ClientIDMode="Static"  />
            </td>
        </tr>
        <tr>
            <td>
                <asp:CheckBox runat="server" ID="cbEmailPeriodic" Text="Send periodic reminders emails" ClientIDMode="Static" onclick="enablePeriodicDays(this)" />
                every <asp:TextBox runat="server" ID="txtPeriodicDays" ClientIDMode="Static" Width="25" CssClass="text-center"></asp:TextBox> day(s).
            </td>
        </tr>
        <tr>
            <td>
                Due date:&nbsp; On <asp:TextBox runat="server" ID="txtDueDate" placeholder="mm/dd/yyyy" CssClass="text-center" ClientIDMode="Static" Width="86" onkeyup="checkDueSettings(true)" onchange="checkDueSettings(true)"></asp:TextBox>
                &nbsp;or&nbsp;
                <asp:TextBox runat="server" ID="txtDueDays" placeholder="dd" CssClass="text-center" ClientIDMode="Static" Width="34" onkeyup="checkDueSettings(false)" onchange="checkDueSettings(false)"></asp:TextBox>
                days after assignment.
            </td>
        </tr>
        <tr>
            <td>
                <asp:CheckBox runat="server" ID="cbEmailNearDueDate" Text='Send "near" due date reminder email' ClientIDMode="Static" onclick="enableNearDueDays(this)" />
                <asp:TextBox runat="server" ID="txtNearDueDateDays" ClientIDMode="Static" Width="25" CssClass="text-center"></asp:TextBox> day(s) before the due date.
            </td>
        </tr>
        <tr>
            <td>
                <asp:CheckBox runat="server" ID="cbEmailDueDate" Text='Send "on due date" reminder email' ClientIDMode="Static"  />
            </td>
        </tr>
        <tr>
            <td>
                <asp:CheckBox runat="server" ID="cbEmailOverdue" Text='Send "Overdue" reminder email' ClientIDMode="Static" onclick="enableOverdueDays(this)" />
                <asp:TextBox runat="server" ID="txtOverdueDays" ClientIDMode="Static" Width="25" CssClass="text-center"></asp:TextBox> day(s) after due date.
            </td>
        </tr>
    </table>
         

</asp:Content>
