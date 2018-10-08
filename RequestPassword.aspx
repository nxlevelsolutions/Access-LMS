<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="Site.Master" CodeBehind="RequestPassword.aspx.cs" Inherits="NXLevel.LMS.RequestPassword" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style type="text/css">
      

    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h2>Forgot password</h2>
    </div>

    <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">

        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">
            
            <asp:Label ID="lblError" runat="server" CssClass="alert alert-danger btn-block" Visible="false" Text="" />
            <br />
            <p>
                <asp:Label ID="lblRequestPassword" runat="server" Text="Please enter your Email Address. We will email you your password." />
            </p>
                     
            <asp:TextBox name="Email" size="19" ID="txtEmail" runat="server" placeholder="Email address" CssClass="form-control"></asp:TextBox><br />
            <asp:Button ID="btnRequestPasswordSubmit" runat="server" CssClass="btn btn-primary form-control" Text="Submit" OnClick="btnSubmit_Click" />

            <p>&nbsp;</p>
            <p><a href="Login.aspx">Return to Login</a></p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>

    </div>

</asp:Content>
