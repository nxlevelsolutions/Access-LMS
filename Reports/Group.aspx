<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Group.aspx.cs" Inherits="NXLevel.LMS.Reports.Group" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
   <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li><a href="groups.aspx">Groups</a></li>
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
                        <th>Last name</th>
                        <th>First name</th>
                        <th>Email</th>
                        <th>Average score</th>
                    </thead>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td>&nbsp;</td>
                    <td><%--<%# Eval("avgScore", "{0:F2}%") %>--%></td>
                    <td></td>
                    <td></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
        
    </div>
</asp:Content>
