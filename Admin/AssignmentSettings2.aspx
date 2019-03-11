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

            //check registration code
            if ($('#cbSelfRegister').prop('checked') && $('#tbRegisterCode').val()=="") {
                $("#errMessage").html("Please enter a Registration Code or deselect the 'Allow self-registration' option.");
                return;
            }

            //check periodic reminders
            if ($('#cbEmailPeriodic').prop('checked') && $('#txtPeriodicDays').val() == "") {
                $("#errMessage").html("The 'Send periodic reminders' option was checked, but no days were specified.");
                return;
            }


            if ($('#cbEmailNearDueDate').prop('checked') && $('#txtNearDueDateDays').val() == "") {
                $("#errMessage").html("The 'Send near due date' option was checked, but no days were specified.");
                return;
            }

            //check due date options
            if ($('#txtDuedate').val() == "") { //no due date specified
                if ($('#cbEmailNearDueDate').prop('checked')) {
                    $("#errMessage").html("The 'Send near due date' option was checked, but no 'Due Date' was specified.");
                    return;
                }

                if ($('#cbEmailDueDate').prop('checked')) {
                    $("#errMessage").html("The 'Send on due date' option was checked, but no 'Due Date' was specified.");
                    return;
                }

                if ($('#cbEmailOverdue').prop('checked')) {
                    $("#errMessage").html("The 'Send overdue email' option was checked, but no 'Due Date' was specified.");
                    return;
                }

            }

            parent.window.disableOK();
            Utils.Post("AssignmentSettings.aspx/Save",
                {
                    enabled: $('#cbEnabled').prop('checked'),
                    allowSelfRegister: $('#cbSelfRegister').prop('checked'),
                    registerCode: $('#tbRegisterCode').val(),
                    dueDate: $('#txtDuedate').val() == "" ? null : $('#txtDuedate').val(),
                    emailOnAssigned: $('#cbEmailOnAssigned').prop('checked'),
                    emailPeriodic: $('#cbEmailPeriodic').prop('checked'),
                    periodicDays: $('#txtPeriodicDays').val() == "" ? null : $('#txtPeriodicDays').val(),
                    emailNearDueDate: $('#cbEmailNearDueDate').prop('checked'),
                    nearDueDateDays: $('#txtNearDueDateDays').val() == "" ? null : $('#txtNearDueDateDays').val(),
                    emailOnDueDate: $('#cbEmailDueDate').prop('checked'),
                    emailOverdue: $('#cbEmailOverdue').prop('checked')
                },
                function (response) {
                    if (response.error == "") {
                        parent.window.closeWin(true);
                    }
                    else {
                        parent.window.disableOK(false);
                        $("#errMessage").html(response.error);
                    }
                }
            );
            
        }

        function enableRegCode(ctrl) {
            $('#tbRegisterCode').prop('disabled', !ctrl.checked);
            if (ctrl.checked) {
                $('#tbRegisterCode').prop('placeholder', "Enter registration code");
                $('#tbRegisterCode').focus();
            }
            else {
                $('#tbRegisterCode').val("");
                $('#tbRegisterCode').prop('placeholder', "");
            }
        }

        function enablePeriodicDays(ctrl) {
            $('#txtPeriodicDays').prop('disabled', !ctrl.checked);
            if (ctrl.checked) {
                $('#txtPeriodicDays').focus();
            }
            else {
                $('#txtPeriodicDays').val("");
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

        function checkDate(ctrl) {
            if (Date.parse(ctrl.value)) {
                $('#cbEmailNearDueDate').prop('disabled', false); 
                $('#cbEmailDueDate').prop('disabled', false); 
                $('#cbEmailOverdue').prop('disabled', false);
            }
            else {
                $('#cbEmailNearDueDate').prop('disabled', true); $('#cbEmailNearDueDate').prop('checked', false);
                $('#cbEmailDueDate').prop('disabled', true); $('#cbEmailDueDate').prop('checked', false);
                $('#cbEmailOverdue').prop('disabled', true); $('#cbEmailOverdue').prop('checked', false);
                $('#txtNearDueDateDays').prop('disabled', true); $('#txtNearDueDateDays').val("");
            }
        }

        $(document).ready(function () {
            $('#tbRegisterCode').prop('disabled', !$('#cbSelfRegister').prop("checked"));
            $("#txtDuedate").datepicker();
            $('#txtPeriodicDays').prop('disabled', !$('#cbEmailPeriodic').prop("checked"));
            $('#txtNearDueDateDays').prop('disabled', !$('#cbEmailNearDueDate').prop("checked"));
            $('[data-toggle="tooltip"]').tooltip();
            checkDate(document.getElementById('txtDuedate'));
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div id="errMessage" class="required-red"></div>
    
    <ul class="nav nav-tabs" >
        <li class="active"><a href="#tab1" data-toggle="tab">Settings</a></li>
        <li><a href="#tab2" data-toggle="tab">Email Notifications</a></li>
    </ul>

    <div class="tab-content">
        <div class="tab-pane fade in active" id="tab1">
            <p>&nbsp;</p>
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
                        <asp:CheckBox runat="server" ID="cbSelfRegister" Text="Allow self-registration" ClientIDMode="Static" onclick="enableRegCode(this)" 
                            data-toggle="tooltip" 
                            data-placement="right" 
                            title="Self-registration allows new users to be assigned this Learning Plan automatically."/>
                        <p class="small">Registration code to use in self-registration page:</p>
                        <asp:TextBox runat="server" ID="tbRegisterCode"  ClientIDMode="Static"
                            data-toggle="tooltip" 
                            data-placement="bottom" 
                            title="When this registration code is entered by new users, this Learning Plan's course(s) get automatically assigned to them."></asp:TextBox> 
                    </td>
                </tr>
            </table>
        </div>

        <div class="tab-pane fade" id="tab2">
            <p>&nbsp;</p>
            <table class="table">
                <tr>
                    <td>
                        Due date:
                        <asp:TextBox runat="server" ID="txtDuedate" placeholder="mm/dd/yyyy" CssClass="text-center" ClientIDMode="Static" Width="82" onchange="checkDate(this)"></asp:TextBox>
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
                        <asp:CheckBox runat="server" ID="cbEmailOverdue" Text='Send "Overdue" reminder email' ClientIDMode="Static"  />
                    </td>
                </tr>
            </table>
        </div>
    </div>

</asp:Content>
