<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="AccessCode.aspx.cs" Inherits="NXLevel.LMS.AccessCode" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h2>Access Code Activation - Training Center</h2>
    </div>

    <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">
            <p>&nbsp;</p>
            <asp:Label ID="lblErrMsg" runat="server" CssClass="alert alert-danger btn-block " Visible="false" Text="" />
            <p>Since this is your first time logging in, we sent you an email containing your Personal Access Code for verification purposes.  (Please check your INBOX and JUNK mail folders.) Once you’ve received it, please enter the Code in the corresponding box below to verify and activate your account.  You can only do this once.  In addition, please select a new, unique password of at least 4 characters.  Write this password down. You will use it to log in from now on.</p>
            <label for="txtEmail">Email:</label>
            <asp:TextBox name="txtEmail" size="19" ID="txtEmail" runat="server" CssClass="form-control"></asp:TextBox><br />
            <label for="txtPwd1">Choose Password:</label>
            <asp:TextBox name="txtPwd1" size="19" ID="txtPwd1" runat="server" CssClass="form-control" TextMode="Password"></asp:TextBox><br />
            <label for="txtPwd2">Retype Password:</label>
            <asp:TextBox name="txtPwd2" size="19" ID="txtPwd2" runat="server" CssClass="form-control" TextMode="Password"></asp:TextBox><br />
            <label for="txtAccessCode">Access Code:</label>
            <asp:TextBox name="txtAccessCode" size="19" ID="txtAccessCode" runat="server" CssClass="form-control"></asp:TextBox><br />
            <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-primary form-control" Text="Submit" OnClick="btnSubmit_Click" />

            <p>&nbsp;</p>
            <p><a href="Login.aspx">Return to Login</a></p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
    </div>

    <p>&nbsp;</p>

</asp:Content>
