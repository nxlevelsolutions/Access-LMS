<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="EmailEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.EmailEditor" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <style type="text/css">
        #mceu_25 {
            display: none;
        }
    </style>
    <script src="../js/tinymce/tinymce.min.js"></script>
    <script src="../js/tinymce.plugin.js"></script>
    <script>

        function onSave() {
            Utils.Post("EmailEditor.aspx/SaveEmail",
                {
                    subject: $('#Subject').val(),
                    contents: tinymce.activeEditor.getContent()  
                },
                function (response) {
                    parent.window.closeWin(true);
                }
            );
        }

        $(document).ready(function () {
            tinymce.init({
                selector: 'textarea#Editor',
                menubar: false,
                theme: 'modern',
                toolbar: 'undo redo | bold italic underline | alignleft, aligncenter, alignright, alignjustify | bullist, numlist, outdent, indent | code | lmskeywords',
                plugins: 'code lmskeywords',
                height: 370
            });
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    Subject line:
    <asp:TextBox ID="Subject" runat="server" Width="100%" ClientIDMode="Static"></asp:TextBox>
    <br />
    <br />

    <table width="100%">
        <tr>
            <td>Contents:</td>
            <td align="right">
                <%-- Insert: <select onchange="if (this.value) tinymce.activeEditor.insertContent(this.value);" style="margin-bottom: 3px;">
                    <option value="">built-in key words</option>
                    <option value="{LearnerName}">Learner name</option>
                    <option value="{CourseTitle}">Course title</option>
                </select>--%>
            </td>
        </tr>
    </table>
    <asp:TextBox ID="Editor" runat="server" ClientIDMode="Static" TextMode="MultiLine"></asp:TextBox>

</asp:Content>
