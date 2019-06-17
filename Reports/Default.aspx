<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="NXLevel.LMS.Reports.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <p>&nbsp;</p>
    <h3><span class="fa fa-bar-chart"></span> Reports by Learners/Direct Reports:</h3>
    <div class="panel panel-default">
    <table class="table evenrowcolor">
        <tr>
            <td><a href='users.aspx'>View all users</a></td>
        </tr>
    </table>
    </div>

    <p>&nbsp;</p>
    <h3><span class="fa fa-bar-chart"></span> Reports by Course:</h3>
   <div class="panel panel-default">
    <table class="table evenrowcolor">
        <tr>
            <td><a href="courses.aspx">View all courses</a></td>
        </tr>
    </table>
    </div>

<%--    <p>&nbsp;</p>
    <h3><span class="fa fa-bar-chart"></span> Reports by Groups:</h3>
    <div class="panel panel-default">
    <table class="table evenrowcolor">
        <tr>
            <td><a href="groups.aspx">View all Groups</a></td>
        </tr>
    </table>
    </div>

    <p>&nbsp;</p>
    <h3><span class="fa fa-bar-chart"></span> Reports by Activities:</h3>
    <div class="panel panel-default">
    <table class="table evenrowcolor">
        <tr>
            <td><a href="assignments.aspx">View all Activities</a></td>
        </tr>
    </table>
    </div>--%>

</asp:Content>
