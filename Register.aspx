<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Register.aspx.cs" Inherits="NXLevel.LMS.Register" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="glyphicon glyphicon-saved"></span> Registration</h3>
    </div>

    <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">

            <p>&nbsp;</p>
            <asp:Label ID="ErrorMsg" runat="server" CssClass="required-red" Text="" />
            <p>You will need a valid Registration Code and a Company Code to use the form below. If you do not have these codes please contact your training administrator.</p>

            <label for="txtFName">First name:</label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFName" runat="server" ErrorMessage="First name is required." ControlToValidate="txtFName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtFName" size="19" ID="txtFName" runat="server" CssClass="form-control" required autofocus placeholder="Enter your first name"></asp:TextBox><br />

            <label for="txtLName">Last name:</label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="Last name is required." ControlToValidate="txtLName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtLName" size="19" ID="txtLName" runat="server" CssClass="form-control" required placeholder="Enter your last name"></asp:TextBox><br />

            <label for="txtEmail">Email:</label> <div class="asterisk required-red"></div>
            <asp:RegularExpressionValidator ID="validateEmail"    
                  runat="server" ErrorMessage="Please enter a valid email."
                  ControlToValidate="txtEmail" 
                  ValidationExpression="^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$"
                  Display="Dynamic" CssClass="required-red"/>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="An email is required." ControlToValidate="txtEmail" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtEmail" size="19" ID="txtEmail" runat="server" CssClass="form-control" required placeholder="Enter your email"></asp:TextBox><br />

            <label for="txtTitle">Title:</label>  
            <asp:TextBox name="txtTitle" size="19" ID="txtTitle" runat="server" CssClass="form-control" placeholder="Enter your title"></asp:TextBox><br />

            <label for="txtPwd1">Choose Password:</label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ErrorMessage="A password of 7 to 10 characters is required." ControlToValidate="txtPwd1" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:RegularExpressionValidator ID="RegExp1" runat="server"    
                ErrorMessage="Password length must be between 7 to 10 characters"
                ControlToValidate="txtPwd1"    
                ValidationExpression="^[a-zA-Z0-9'@&#.\s]{7,10}$"
                Display="Dynamic" CssClass="required-red" />
            <asp:TextBox name="txtPwd1" size="19" ID="txtPwd1" runat="server" CssClass="form-control" TextMode="Password" required placeholder="Password length must be between 7 to 10 alphanumeric characters"></asp:TextBox><br />
<%--            <label for="txtPwd2">Retype Password:</label> <div class="asterisk required-red"></div>
            <asp:TextBox name="txtPwd2" size="19" ID="txtPwd2" runat="server" CssClass="form-control" TextMode="Password" required></asp:TextBox><br />--%>

            <label for="txtRegisterCode">Registration Code:</label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="rfvRegistrationCode" runat="server" ErrorMessage="A Registration Code is required." ControlToValidate="txtRegisterCode" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtRegisterCode" size="19" ID="txtRegisterCode" runat="server" CssClass="form-control" required placeholder="Enter a valid Registration Code"></asp:TextBox><br />

            <label for="txtAccessCode">Company Code:</label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="rfvCompanyCode" runat="server" ErrorMessage="A Company Code  is required." ControlToValidate="txtCompanyCode" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtCompanyCode" size="19" ID="txtCompanyCode" runat="server" CssClass="form-control" required placeholder="Enter a valid Company Code"></asp:TextBox><br />

            <label for="txtMgrEmail">Manager's email:</label>  
            <asp:TextBox name="txtMgrEmail" size="19" ID="txtMgrEmail" runat="server" CssClass="form-control" placeholder="Enter your manager's email"></asp:TextBox><br />

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
