<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="History.aspx.cs" Inherits="NXLevel.LMS.History" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="fa fa-bar-chart"></span> Past activities</h3>
    </div>

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
        
        <asp:Repeater ID="rptEvents" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
                    <tr>
                        <th>Activity</th>
                        <th>Course</th>
                        <th class="text-center">Event</th>
                        <th class="text-center">Date</th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><%# Eval("assignmentTitle") %></td>
                    <td><%# Eval("title") %></td>
                    <td align="center"><%# Eval("event") %></td>
                    <td align="center"><%# Eval("dateStamp") %></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>

</asp:Content>
