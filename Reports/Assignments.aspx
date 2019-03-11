<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Assignments.aspx.cs" Inherits="NXLevel.LMS.Reports.Assignments" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li class="active">Activities</li>
    </ol>

    <div class="panel panel-default">
        <div class="panel-heading">
            <table width="100%">
                <tr>
                    <td><b>Assignments</b></td>
                    <td align="right"> 
                        <asp:LinkButton runat="server" ID="lnkDownload1" Text="" OnClick="lnkDownload1_Click"><span class="fa fa-download"></span> Download Excel report</asp:LinkButton>
                    </td>
                </tr>
            </table>
        </div>
        
        <asp:Repeater ID="rptAssignments1" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><a href='assignment.aspx?aid=<%# Eval("assignmentId") %>&title=<%#  Server.UrlEncode((string) Eval("title")) %>'><%# Eval("title") %></a></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>


    <div class="panel panel-default">
        <div class="panel-heading">
            <table width="100%">
                <tr>
                    <td><b>Learning Plans</b></td>
                    <td align="right"> 
                        <asp:LinkButton runat="server" ID="lnkDownload2" Text="" OnClick="lnkDownload2_Click"><span class="fa fa-download"></span> Download Excel report</asp:LinkButton>
                    </td>
                </tr>
            </table>
        </div>
        
        <asp:Repeater ID="rptAssignments2" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><a href='assignment.aspx?aid=<%# Eval("assignmentId") %>&title=<%#  Server.UrlEncode((string) Eval("title")) %>'><%# Eval("title") %></a></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>

</asp:Content>
