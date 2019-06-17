<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="help.aspx.cs" Inherits="NXLevel.LMS.help" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="fa fa-question-circle"></span> <%= GetLocalResourceObject("PageTitle")%></h3>
    </div>

    <%= GetLocalResourceObject("Text1")%>
    

</asp:Content>
