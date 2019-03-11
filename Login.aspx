<%@ Page Language="C#" MasterPageFile="Site.Master" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="NXLevel.LMS.Login" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
     <script type="text/javascript" >
        if (window.parent != window)
        {   //make sure iframes refresh the parent window when session times out
            window.parent.document.location.href = window.parent.document.location.href;
        }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2 align="center">Welcome to NXLevel Solutions' Access LMS</h2>

    <div class="row" style="background-color:#f1f7fd; border-radius:10px; margin:0px">

		<div class="col-md-1 hidden-xs">
            &nbsp;
        </div>
        <div class="col-md-5">
             
            <!--email-->
            <br/>
            <asp:Label ID="ErrorMsg" Visible="false" runat="server" CssClass="alert alert-danger btn-block" role="alert" Text="" />
                        
            <label for="Email">Please enter your email address below.</label>
            <table width="100%">
                <tr>
                    <td width="30" bgcolor="#d9edf7" align="center"><img src="images/icon_username.svg" width="15" /></td>
                    <td><asp:TextBox name="Email" size="19" ID="Email" runat="server" CssClass="form-control" placeholder="Email address" required autofocus></asp:TextBox></td>
                </tr>
            </table> 
            
            <!--password-->
            <br />
            <label for="Pwd">Please enter your password.</label>
            <table width="100%">
                <tr>
                    <td width="30" bgcolor="#d9edf7" align="center"><img src="images/icon_lock.svg" width="15" /></td>
                    <td><asp:TextBox name="Pwd" size="19" ID="Pwd" runat="server" CssClass="form-control" TextMode="Password" placeholder="Password" required></asp:TextBox></td>
                </tr>
            </table>

            <!--company code-->
            <br />
            <label for="CompanyCode">Please enter your company code.</label>
            <table width="100%">
                <tr>
                    <td width="30" bgcolor="#d9edf7" align="center"><img src="images/icon_company.svg" width="15" /></td>
                    <td><asp:TextBox name="CompanyCode" size="19" ID="CompanyCode" runat="server" CssClass="form-control" placeholder="Company code" Text="nxlevel" required></asp:TextBox></td>
                </tr>
            </table>


            <br />
            <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-primary form-control" Text="Login &raquo;" OnClick="btnSubmit_Click" />

             <p>&nbsp;</p>
            <table width="100%">
                <tr>
                    <td><a href="RequestPassword.aspx">Forgot password?</a></td>
                    <td align="right"><a href="Register.aspx">Register new user</a></td>
                </tr>
            </table>
            <p>&nbsp;</p>
        </div>
        <div class="col-md-5 text-muted">
            <br/>
            If your email is not recognized by the system please contact email@yourcompany.com. If you have received an <b>Access Code</b> please
            <a href="AccessCode.aspx">enter the code here</a>.
            <p>&nbsp;</p>
        </div>
        <div class="col-md-1 hidden-xs">
            &nbsp;
        </div>

    </div>
    
</asp:Content>
