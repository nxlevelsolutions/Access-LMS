<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Register.aspx.cs" Inherits="NXLevel.LMS.Register" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css" rel="stylesheet" /> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"></script>
    <script>
        $(document).ready(function () {
            $('#ddOrganization').select2(); //setup org search
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="glyphicon glyphicon-saved"></span> <%= GetLocalResourceObject("PageTitle")%></h3>
    </div>

    <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">

            <p>&nbsp;</p>
            <asp:Label ID="ErrorMsg" runat="server" CssClass="required-red" Text="" />
            <p><%= GetLocalResourceObject("Text1")%></p>

            <label for="txtFName"><%= GetLocalResourceObject("LabelFirstName")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFName" runat="server" ErrorMessage="<%$ Resources: ReqFirstName %>" ControlToValidate="txtFName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtFName" size="19" ID="txtFName" runat="server" CssClass="form-control" required autofocus ></asp:TextBox><br />

            <label for="txtLName"><%= GetLocalResourceObject("LabelLastName")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator1" runat="server" ErrorMessage="<%$ Resources: ReqLastName %>" ControlToValidate="txtLName" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtLName" size="19" ID="txtLName" runat="server" CssClass="form-control" required ></asp:TextBox><br />

            <label for="txtNewEmail"><%= GetLocalResourceObject("LabelEmail")%></label> <div class="asterisk required-red"></div>
            <asp:RegularExpressionValidator ID="validateEmail"    
                  runat="server" ErrorMessage="<%$ Resources: ReqValidEmail %>"
                  ControlToValidate="txtNewEmail" 
                  ValidationExpression="^([\w\.\-]+)@([\w\-]+)((\.(\w){2,4})+)$"
                  Display="Dynamic" CssClass="required-red"/>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator3" runat="server" ErrorMessage="<%$ Resources: ReqEmail %>" ControlToValidate="txtNewEmail" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox size="19" ID="txtNewEmail" runat="server" ClientIDMode="Static" CssClass="form-control" autocomplete="off" AutoCompleteType="Disabled" required ViewStateMode="Enabled"></asp:TextBox><br />

            <label for="txtTitle"><%= GetLocalResourceObject("LabelTitle")%></label>  
            <asp:TextBox name="txtTitle" size="19" ID="txtTitle" runat="server" CssClass="form-control" ></asp:TextBox><br />

            <%--<label for="txtPwd1"><%= GetLocalResourceObject("LabelPwd")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="RequiredFieldValidator4" runat="server" ErrorMessage="<%$ Resources: ReqPwd %>" ControlToValidate="txtPwd1" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:RegularExpressionValidator ID="RegExp1" runat="server"    
                ErrorMessage="<%$ Resources: ReqInvalidPwd %>"
                ControlToValidate="txtPwd1"    
                ValidationExpression="^[a-zA-Z0-9'@&#.\s]{7,200}$"
                Display="Dynamic" CssClass="required-red" />
            <asp:TextBox name="txtPwd1" size="19" ID="txtPwd1" runat="server" CssClass="form-control" ClientIDMode="Static" TextMode="Password" AutoCompleteType="None" autocomplete="new-password" required ></asp:TextBox>
            <span id="passwordToggle" class="fa fa-eye password-toggle" aria-hidden="true"></span><br />--%>
<%--            <label for="txtPwd2">Retype Password:</label> <div class="asterisk required-red"></div>
            <asp:TextBox name="txtPwd2" size="19" ID="txtPwd2" runat="server" CssClass="form-control" TextMode="Password" required></asp:TextBox><br />--%>

            <label for="txtRegisterCode"><%= GetLocalResourceObject("LabelRegCode")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="rfvRegistrationCode" runat="server" ErrorMessage="<%$ Resources: ReqRegCode %>" ControlToValidate="txtRegisterCode" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <asp:TextBox name="txtRegisterCode" size="19" ID="txtRegisterCode" runat="server" CssClass="form-control" required ></asp:TextBox>
            <br />

            <label for="txtAccessCode"><%= GetLocalResourceObject("LabelOrganization")%></label> <div class="asterisk required-red"></div>
            <asp:RequiredFieldValidator ID="rfvOrganization" runat="server" ErrorMessage="<%$ Resources: ReqOrganization %>" ControlToValidate="ddOrganization" Display="Dynamic" CssClass="required-red"></asp:RequiredFieldValidator>
            <%--<asp:TextBox name="txtCompanyCode" size="19" ID="txtCompanyCode" runat="server" CssClass="form-control" required ></asp:TextBox>--%>
            <asp:DropDownList runat="server" ID="ddOrganization" ClientIDMode="Static" CssClass="form-control" AppendDataBoundItems="true">
                <asp:ListItem Text="Select organization" Value=""></asp:ListItem>
            </asp:DropDownList>
            <br /><br /><br />

            <%--<label for="txtMgrEmail"><%= GetLocalResourceObject("LabelMngrEmail")%></label>  
            <asp:TextBox name="txtMgrEmail" size="19" ID="txtMgrEmail" runat="server" CssClass="form-control" ></asp:TextBox><br />--%>

            <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-primary form-control" Text="<%$ Resources: Global, BtnSubmit %>" OnClick="btnSubmit_Click" />

            <p>&nbsp;</p>
            <p><a href="Login.aspx"><%= Resources.Global.ReturnToLogin %></a></p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
    </div>

    <p>&nbsp;</p>

</asp:Content>
