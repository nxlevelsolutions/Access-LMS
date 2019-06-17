<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="CourseEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.CourseEditor" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        input[type=text] {
            width: 100%;
        }
 
    </style>
    <script>

        var courseId = Utils.getQueryVariable("cid");

        function onSave() {
            Utils.Post("CourseEditor.aspx/SaveCourse",
                {
                    title: $('#tbTitle').val(),
                    description: $('#tbDescription').val(),
                    enabled: $('#cbEnabled').prop("checked"),
                    url: $('#tbUrl').val(),
                    width: $('#tbWidth').val(),
                    height: $('#tbHeight').val()
                },
                function (response) {
                    parent.window.closeWin(true);
                }
            );
        }

    </script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <table class="table table-condensed">
        <tr>
            <td colspan="2">Title:
            <asp:TextBox ID="tbTitle" runat="server" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
        <tr>
            <td colspan="2">Description:
            <asp:TextBox ID="tbDescription" runat="server" ClientIDMode="Static" TextMode="MultiLine" Rows="4"></asp:TextBox></td>
        </tr>
        <tr>
            <td width="60">Enabled:</td>
            <td>
                <asp:CheckBox ID="cbEnabled" runat="server" ClientIDMode="Static" Checked="true" /></td>
        </tr>
        <tr>
            <td colspan="2">Start page: 
            <asp:TextBox ID="tbUrl" runat="server" ClientIDMode="Static"></asp:TextBox></td>
        </tr>
        <tr>
            <td colspan="2">
                Initial course window size:
                <asp:TextBox ID="tbWidth" runat="server" ClientIDMode="Static" Width="40"></asp:TextBox> (width) x
                <asp:TextBox ID="tbHeight" runat="server" ClientIDMode="Static" Width="40"></asp:TextBox> (height)

            </td>
        </tr>
    </table>

</asp:Content>
