<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="Site.Master" CodeBehind="RequestPassword.aspx.cs" Inherits="NXLevel.LMS.RequestPassword" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style type="text/css">
      

    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
 
    <div class="col-xs-7 col-sm-6 col-md-5 col-lg-4">
        <div class="row">
            <asp:Label ID="lblError" runat="server" CssClass="errorMessage" Text="" />
        </div>
        <div class="row">
            Please enter your Email Address.<br />
            <asp:Label ID="lblRequestPassword" runat="server" Text="We will email you your password." />   
        </div>
        <div class="row">
            <div class="request-password">
                <p>Email Address:</p>
                <asp:TextBox name="Email" size="19" ID="txtEmail" runat="server" CssClass="form-control"></asp:TextBox><br />                    
                <asp:Button ID="btnRequestPasswordSubmit" runat="server" CssClass="btn btn-primary btn-sm form-control" Text="Submit" OnClick="btnSubmit_Click" />
            </div>
        </div>
        <div class="row">
            <a href="Login.aspx">Return to Login</a>
        </div>  
    </div>        
    
</asp:Content>
