<%@ Page Language="C#" MasterPageFile="Site.Master" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="NXLevel.LMS.Login" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
   
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2 align="center">Welcome to {CompanyName} Learning Portal</h2>

    <div class="row" style="background-color:#f1f7fd; border-radius:10px; margin:0px">

		<div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">
 
            <table width="100%">
                <tr>
                    <td>
                         <!--email-->
                        <br/>
                        <asp:Label ID="ErrorMsg" Visible="false" runat="server" CssClass="alert alert-danger btn-block" role="alert" Text="" />
                        
                        <p>Please enter your email address below.</p>
                        <table width="100%">
                            <tr>
                                <td width="30" bgcolor="#d9edf7" align="center"><img src="images/icon_username.svg" width="15" /></td>
                                <td><asp:TextBox name="Email" size="19" ID="Email" runat="server" CssClass="form-control" placeholder="Email address" required autofocus></asp:TextBox></td>
                            </tr>
                        </table> 
                        <!--password-->
                        <br />
                        <p>Please enter your password.</p>
                        <table width="100%">
                            <tr>
                                <td width="30" bgcolor="#d9edf7" align="center"><img src="images/icon_lock.svg" width="15" /></td>
                                <td><asp:TextBox name="Password" size="19" ID="Pwd" runat="server" CssClass="form-control" TextMode="Password" placeholder="Password" required></asp:TextBox></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr><td>&nbsp;</td></tr>
                <tr>
                    <td>
                        <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-md btn-info btn-block " Text="Login &raquo;" OnClick="btnSubmit_Click" />
                    </td>
                </tr>
            </table>

             <p>&nbsp;</p>
            <p><a href="RequestPassword.aspx">Forgot password?</a></p>
        </div>
        <div class="col-md-5 text-muted">
            <br/>
            If your email is not recognized by the system please contact email@yourcompany.com.
            <p>&nbsp;</p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>

    </div>
    
</asp:Content>
