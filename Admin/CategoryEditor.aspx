<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="CategoryEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.CategoryEditor" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script>

        function onSave() {
            Utils.Post("CategoryEditor.aspx/SaveCategory",
                {
                    title: $('#tbTitle').val() 
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
            <td>Title:
            <asp:TextBox ID="tbTitle" runat="server" ClientIDMode="Static" Width="100%"></asp:TextBox></td>
        </tr>
    </table>
</asp:Content>
