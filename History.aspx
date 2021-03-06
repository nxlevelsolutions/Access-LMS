﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="History.aspx.cs" Inherits="NXLevel.LMS.History" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script>
        function viewCertificate(assigId, courseId) {
            certWin = window.open("admin/certificate.aspx?cid=" + courseId + "&aid=" + assigId, 800, 600);
        }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="fa fa-bar-chart"></span> <%= GetLocalResourceObject("PageTitle")%></h3>
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
                        <th><%= Resources.Global.LabelDownloadCert %></th>
                        <th class="text-center"><%= Resources.Global.LabelCompleted %></th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><%# Eval("assignmentTitle") %></td>
                    <td><%# Eval("title") %></td>
                    <td align="center"><a class="certificate" href='javascript:viewCertificate(<%# Eval("assignmentId") %>, <%# Eval("courseId") %>);'><span class="fa fa-download"></span> </a></td>
                    <td align="center"><%# Eval("dateStamp", "{0:MM/dd/yyyy hh:mm tt}") %></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>

</asp:Content>
