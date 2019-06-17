<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="Site.Master" CodeBehind="RequestPassword.aspx.cs" Inherits="NXLevel.LMS.RequestPassword" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style type="text/css">
      

    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="fa fa-envelope"></span> <%= GetLocalResourceObject("PageTitle")%></h3>
    </div>

    <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">

        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">
            
            <asp:Label ID="lblError" runat="server" CssClass="alert alert-danger btn-block" Visible="false" Text="" />
            <br />
            <p>
                <asp:Label ID="lblRequestPassword" runat="server" Text="<%$ Resources:Text1 %>" />
            </p>
                     
            <asp:TextBox name="Email" size="19" ID="txtEmail" runat="server"  CssClass="form-control" ClientIDMode="Static"></asp:TextBox><br />

            <!--company code-->
            <%--<label for="CompanyCode"><%= HttpContext.GetLocalResourceObject("~/Login.aspx", "EnterCode")%></label>
            <asp:TextBox name="CompanyCode" size="19" ID="CompanyCode" runat="server" CssClass="form-control"  Text="nxlevel" required ClientIDMode="Static"></asp:TextBox>--%>

            <br />
            <asp:Button ID="btnRequestPasswordSubmit" runat="server" CssClass="btn btn-primary form-control" Text="<%$ Resources:Global, BtnSubmit %>" OnClick="btnSubmit_Click" />

            <p>&nbsp;</p>
            <p><a href="Login.aspx"><%= Resources.Global.ReturnToLogin %></a></p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>

    </div>

</asp:Content>
