<%@ Page Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="AccessCode.aspx.cs" Inherits="NXLevel.LMS.AccessCode" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style type="text/css">
        .password-toggle {
            float: right;
            margin-right: 6px;
            margin-top: -22px;
            position: relative;
            z-index: 2;
        }
    </style>
    <script>
        $(document).ready(function () {
            $('#txtPwd1').attr('type', 'password');
            $('#passwordToggle1').click(function () { //setup eye1
                if ($('#txtPwd1').attr('type') == 'password') {
                    $('#txtPwd1').attr('type', 'text');
                } else {
                    $('#txtPwd1').attr('type', 'password');
                }
            });

            $('#txtPwd2').attr('type', 'password');
            $('#passwordToggle2').click(function () { //setup eye2
                if ($('#txtPwd2').attr('type') == 'password') {
                    $('#txtPwd2').attr('type', 'text');
                } else {
                    $('#txtPwd2').attr('type', 'password');
                }
            });
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <div class="page-header">
        <h3><span class="fa fa-key"></span> <%=GetLocalResourceObject("PageTitle")%></h3>
    </div>

    <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">
            <p>&nbsp;</p>
            <asp:Label ID="lblErrMsg" runat="server" CssClass="alert alert-danger btn-block " Visible="false" Text="" />
            <%=GetLocalResourceObject("Text1")%>
            <label for="txtEmail"><%=GetLocalResourceObject("EnterEmail")%></label>
            <asp:TextBox name="txtEmail" size="19" ID="txtEmail" runat="server" CssClass="form-control" required autofocus></asp:TextBox><br />

            <label for="txtPwd1"><%=GetLocalResourceObject("EnterPwd1")%></label>
            <asp:TextBox name="txtPwd1" size="19" ID="txtPwd1" runat="server" CssClass="form-control" TextMode="SingleLine" ClientIDMode="Static" AutoCompleteType="None" autocomplete="new-password" required></asp:TextBox>
            <span id="passwordToggle1" class="fa fa-eye password-toggle" aria-hidden="true"></span><br />

            <label for="txtPwd2"><%=GetLocalResourceObject("EnterPwd2")%></label>
            <asp:TextBox name="txtPwd2" size="19" ID="txtPwd2" runat="server" CssClass="form-control" TextMode="SingleLine" ClientIDMode="Static" AutoCompleteType="None" autocomplete="new-password" required></asp:TextBox>
            <span id="passwordToggle2" class="fa fa-eye password-toggle" aria-hidden="true"></span><br />

            <label for="txtAccessCode"><%=GetLocalResourceObject("EnterAccessCode")%></label>
            <asp:TextBox name="txtAccessCode" size="19" ID="txtAccessCode" runat="server" CssClass="form-control" required></asp:TextBox><br />

            <%--<label for="txtCompanyCode"><%=GetLocalResourceObject("EnterCompanyCode")%></label>
            <asp:TextBox name="txtCompanyCode" size="19" ID="txtCompanyCode" runat="server" CssClass="form-control" required></asp:TextBox><br />--%>

            <br />
            <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-primary form-control" Text="<%$ Resources:Global, BtnSubmit %>" OnClick="btnSubmit_Click" />

            <p>&nbsp;</p>
            <p><a href="Login.aspx"><%= Resources.Global.ReturnToLogin %></a></p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
    </div>

    <p>&nbsp;</p>

</asp:Content>
