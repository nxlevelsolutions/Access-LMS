<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="UserCourses.aspx.cs" Inherits="NXLevel.LMS.Reports.UserCourses" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li><a href="users.aspx">All users</a></li>
        <li class="active"><% =Request.QueryString["ln"] %>, <% =Request.QueryString["fn"] %></li>
    </ol>

    <div class="panel panel-default">
        <div class="panel-heading">
            <table width="100%">
                <tr>
                    <td></td>
                    <td align="right"> 
                        <asp:LinkButton runat="server" ID="lnkDownload" Text="" OnClick="lnkDownload_Click"><span class="fa fa-download"></span> Download Excel report</asp:LinkButton>
                    </td>
                </tr>
            </table>
        </div>
        
        <asp:Repeater ID="rptCourses" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
                    <tr>
                        <th>Activity</th>
                        <th>Course</th>
                        <th class="text-center">Started date</th>
                        <th class="text-center">Completed date</th>
                        <%--<th class="text-center">Average score</th>
                        <th class="text-center">Highest score</th>--%>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><%# Eval("assignmentTitle") %></td>
                    <%--<td><a href='usercourse.aspx?uid=<% =Request.QueryString["uid"] %>&aid=<%# Eval("assignmentId") %>&cid=<%# Eval("courseId") %>&title=<%# Server.UrlEncode((string)Eval("courseTitle")) %>&fn=<% =Request.QueryString["fn"] %>&ln=<% =Request.QueryString["ln"] %>'><%# Eval("courseTitle") %></a></td>--%>
                    <td><%# Eval("courseTitle") %></td>
                    <td align="center"><%# Eval("startedDate", "{0:MM/dd/yyyy hh:mm tt}") %></td>
                    <td align="center"><%# Eval("endDate", "{0:MM/dd/yyyy hh:mm tt}") %></td>
                    <%--<td align="center"><%# Eval("avgScore", "{0:F2}%") %></td>
                    <td align="center"><%# Eval("maxScore", "{0:F2}%") %></td>--%>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>
</asp:Content>
