<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Courses.aspx.cs" Inherits="NXLevel.LMS.Reports.Courses" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li class="active">Courses</li>
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
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><a href='courseusers.aspx?cid=<%# Eval("courseId") %>&title=<%# Server.UrlEncode((string)Eval("title")) %>'><%# Eval("title") %></a></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
        
    </div>

</asp:Content>
