<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="CourseUsers.aspx.cs" Inherits="NXLevel.LMS.Reports.CourseUsers" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li><a href="courses.aspx">Courses</a></li>
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
        
        <asp:Repeater ID="rptUsers" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
                    <thead>
                        <th>Group</span></th>
                        <th>Last name</span></th>
                        <th>First name</span></th>
                        <th>Email</th>
                        <th>X</th>
                        <th>Y</th>
                    </thead>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><%# Eval("group") %></td>
                    <td><%# Eval("lastname") %></td>
                    <td><%# Eval("firstName") %></td>
                    <td><%# Eval("email") %></td>
                    <td>X</td>
                    <td>Y</td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
        
    </div>
</asp:Content>
