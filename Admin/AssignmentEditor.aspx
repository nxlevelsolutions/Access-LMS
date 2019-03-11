<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="AssignmentEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.AssignmentEditor" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script language="javascript">
        function onSave() {
            if ($('#tbAssigTitle').val() == "") return;
            Utils.Post("AssignmentEditor.aspx/SaveAssignment",
                {
                    title: $('#tbAssigTitle').val()
                    //enabled: $('#cbEnabled').prop('checked')
                },
                function (response) {
                    parent.window.closeWin(true);
                }
            );
        }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    Title:<br />
    <asp:TextBox ID="tbAssigTitle" runat="server" ClientIDMode="Static" required autofocus></asp:TextBox>

</asp:Content>
