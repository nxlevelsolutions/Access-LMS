<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="UserCourse.aspx.cs" Inherits="NXLevel.LMS.Reports.UserCourse" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
 
    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li><a href="users.aspx">All users</a></li>
        <li><a href="usercourses.aspx?uid=<% =Request.QueryString["uid"] %>&fn=<% =Request.QueryString["fn"] %>&ln=<% =Request.QueryString["ln"] %>"><% =Request.QueryString["ln"] %>, <% =Request.QueryString["fn"] %></a></li>
        <li class="active"><% =Request.QueryString["title"] %></li>
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
        
        <asp:Repeater ID="rptAttempts" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
                    <tr>
                        <th class="text-center">Attempt #</th>
                        <th class="text-center">Date</th>
                        <th class="text-center">Score</th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td align="center"><%# Eval("rowId") %></td>
                    <td align="center"><%# Eval("dateStamp", "{0:MM/dd/yyyy hh:mm tt}") %></td>
                    <td align="center"><%# Eval("score", "{0:F2}%") %></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>
</asp:Content>
