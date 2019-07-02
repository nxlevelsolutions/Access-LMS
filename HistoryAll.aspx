<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="HistoryAll.aspx.cs" Inherits="NXLevel.LMS.HistoryAll" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="fa fa-bar-chart"></span> My History</h3>
    </div>

     <div class="panel panel-default">
        <div class="panel-heading">
            <table width="100%">
                <tr>
                    <td></td>
                    <td align="right"> 
                        <asp:LinkButton runat="server" ID="lnkDownload" Text="" CssClass="white-text" OnClick="lnkDownload_Click"><span class="fa fa-download"></span> <%= Resources.Global.DownloadExcelReport %></asp:LinkButton>
                    </td>
                </tr>
            </table>
        </div>
        
        <asp:Repeater ID="rptEvents" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
                    <tr>
                        <th><%= Resources.Global.LabelActivity %></th>
                        <th><%= Resources.Global.LabelCourse %></th>
                        <th class="text-center"><%= Resources.Global.LabelEvent %></th>
                        <th class="text-center"><%= Resources.Global.LabelDate %></th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><%# Eval("assignmentTitle") %></td>
                    <td><%# Eval("title") %></td>
                    <td align="center"><%# Eval("eventData") %></td>
                    <td align="center"><%# Eval("dateStamp", "{0:MM/dd/yyyy hh:mm tt}") %></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>

</asp:Content>
