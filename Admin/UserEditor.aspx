<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="UserEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.UserEditor" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="../css/sumoselect.min.css" />
    <script src='../js/jquery.sumoselect.min.js'></script>
    <style type="text/css">
    </style>
    <script>
        function onSave() {
            if (Page_ClientValidate()) {
                parent.window.disableOK();
                Utils.Post("UserEditor.aspx/SaveUser",
                    {
                        fname: $('#FName').val(),
                        lname: $('#LName').val(),
                        title: $('#tbTitle').val(),
                        email: $('#Email').val(),
                        mgrEmail: $('#MgrEmail').val(),
                        password: $('#Password').val(),
                        enabled: $('#cbEnabled').prop('checked'),
                        role: $('#lstAccessLevels').val(),
                        groupIds: $('#lstGroups').val()==null ? "": $('#lstGroups').val().toString()
                    },
                    function (response) {
                        parent.window.closeWin(true); 
                    }
                );
            }
        }

        //https://hemantnegi.github.io/jquery.sumoselect/
        $(document).ready(function () {
            $('#lstGroups').SumoSelect({
                placeholder: 'Click to select groups',
                okCancelInMulti: true,
                isClickAwayOk: true 
            });

            $('#lstAccessLevels').SumoSelect({
                placeholder: 'Click to select level',
                okCancelInMulti: true,
                isClickAwayOk: true 
            });
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <table class="table">
        <tr>
            <td>First name: <div class="asterisk required-red"></div>
                <br /><asp:RequiredFieldValidator ID="RequiredFName" runat="server" ErrorMessage="First name is required." ControlToValidate="FName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
                </td>
            <td><asp:TextBox ID="FName" runat="server" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Last name: <div class="asterisk"></div>
                <br /><asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="Last name is required." ControlToValidate="LName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            </td>
            <td><asp:TextBox ID="LName" runat="server" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Title:</td>
            <td><asp:TextBox ID="tbTitle" runat="server" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Email: <div class="asterisk"></div>
                <br /><asp:RegularExpressionValidator ID="validateEmail"    
  runat="server" ErrorMessage="Please enter a valid email."
  ControlToValidate="Email" 
  ValidationExpression="^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$"
  Display="Dynamic" CssClass="required-red"/>
                <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="An email is required." ControlToValidate="Email" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            </td>
            <td><asp:TextBox ID="Email" runat="server" ClientIDMode="Static"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td>Password: <div class="asterisk"></div>
                <br /><asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ErrorMessage="A password of 7 to 10 characters is required." ControlToValidate="Password" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
                <asp:RegularExpressionValidator ID="RegExp1" runat="server"    
ErrorMessage="Password length must be between 7 to 10 characters"
ControlToValidate="Password"    
ValidationExpression="^[a-zA-Z0-9'@&#.\s]{7,10}$"
Display="Dynamic" CssClass="required-red" />
            </td>
            <td><asp:TextBox ID="Password" runat="server" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Access level: <div class="asterisk"></div>
                <br /><asp:RequiredFieldValidator ID="RequiredFieldValidator2" runat="server" ErrorMessage="An access level is required." ControlToValidate="lstAccessLevels" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            </td>
            <td>
                <asp:ListBox ID="lstAccessLevels" runat="server" SelectionMode="Single" CssClass="form-control" ClientIDMode="Static" Width="100%">
                    <asp:ListItem Text="No Access" Value="0"></asp:ListItem>
                    <asp:ListItem Text="Learner" Value="1"></asp:ListItem>
                    <asp:ListItem Text="Manager" Value="2"></asp:ListItem>
                    <asp:ListItem Text="Administrator" Value="4"></asp:ListItem>
                    <asp:ListItem Text="Global Administrator" Value="8"></asp:ListItem>
                    <asp:ListItem Text="System Administrator" Value="16"></asp:ListItem>
                </asp:ListBox>
            </td>
        </tr>
        <tr>
            <td>Groups:</td>
            <td>
                <asp:ListBox ID="lstGroups" runat="server" DataTextField="title" DataValueField="groupId" SelectionMode="Multiple" CssClass="form-control" ClientIDMode="Static" Width="100%">
                </asp:ListBox>
            </td>
        </tr>
        <tr>
            <td>
                Manager's Email:
            </td>
            <td>
                <asp:TextBox ID="MgrEmail" runat="server" ClientIDMode="Static"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td>Account Enabled:</td>
            <td align="left"><asp:CheckBox ID="cbEnabled" runat="server" ClientIDMode="Static" Checked="True" /></td>
        </tr>
    </table>
</asp:Content>
