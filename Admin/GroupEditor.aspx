<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="GroupEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.GroupEditor" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script>

        function onSave() {
            if ($('#tbTitle').val() == "") return;
            Utils.Post("GroupEditor.aspx/SaveGroup",
                {
                    title: $('#tbTitle').val(),
                    enabled: $('#cbEnabled').prop("checked")
                },
                function (response) {
                    parent.window.closeWin(true);
                }
            );
        }

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <table class="table">
        <tr>
            <td colspan="2">Title:
            <asp:TextBox ID="tbTitle" runat="server" ClientIDMode="Static" Width="100%" required autofocus></asp:TextBox></td>
        </tr>
        <tr>
            <td width="60">Enabled:</td>
            <td>
                <asp:CheckBox ID="cbEnabled" runat="server" ClientIDMode="Static" Checked="true" /></td>
        </tr>
    </table>

</asp:Content>
