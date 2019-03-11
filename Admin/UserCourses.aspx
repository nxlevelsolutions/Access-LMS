<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="UserCourses.aspx.cs" Inherits="NXLevel.LMS.Admin.UserCourses" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <style type="text/css">
        .container, select{
            height:100% !important;
            word-wrap:break-word;
        }
    </style>

    <script>

        function onSave() {
            var allVals = [];
            $("#cblCourses input:checked").each(function () {
                allVals.push($(this).val());
            })
            Utils.Post("UserCourses.aspx/SaveAssignedCourses",
                { courseIds: allVals.toString() },
                function (response) {
                    parent.window.closeWin(); 
                }
            );
        }

    </script>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">


    <asp:CheckBoxList ID="cblCourses" runat="server" ClientIDMode="Static"></asp:CheckBoxList>


</asp:Content>
