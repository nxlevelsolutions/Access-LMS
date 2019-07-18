<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="UserCourses.aspx.cs" Inherits="NXLevel.LMS.Reports.UserCourses" %>
<%@ Import Namespace="NXLevel.LMS" %>
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
                        <asp:LinkButton runat="server" ID="lnkDownload" Text="" class="white-text" OnClick="lnkDownload_Click"><span class="fa fa-download"></span> Download Excel report</asp:LinkButton>
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
                        <% if (LmsUser.HasRole(Role.GlobalAdmin) || LmsUser.HasRole(Role.SystemAdmin))
                           { %>
                        <th class="text-center" width="80"></th>
                        <% } %>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><%# Eval("assignmentTitle") %></td>
                    <td><%# Eval("courseTitle") %></td>
                    <td align="center"><%# Eval("startedDate", "{0:MM/dd/yyyy hh:mm tt}") %></td>
                    <td align="center"><%# Eval("endDate", "{0:MM/dd/yyyy hh:mm tt}") %></td>
                    <% if (LmsUser.HasRole(Role.GlobalAdmin) || LmsUser.HasRole(Role.SystemAdmin))
                       { %>
                    <td align="center"><a href="UserCourse.aspx?uid=<% =Request.QueryString["uid"] %>&aid=<%# Eval("assignmentId") %>&cid=<%# Eval("courseId") %>&asgTitle=<%# Server.UrlEncode((string)Eval("assignmentTitle")) %>&title=<%# Server.UrlEncode((string)Eval("courseTitle")) %>&fn=<% =Request.QueryString["fn"] %>&ln=<% =Request.QueryString["ln"] %>"><span class="fa fa-edit"></span></a></td>
                    <% } %>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>
</asp:Content>
