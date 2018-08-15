<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AccessCode.aspx.cs" Inherits="NXLevel.LMS.AccessCode" %>

<!DOCTYPE html>

<html lang="en">
<head runat="server">
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta http-equiv="pragma" content="no-cache" />
    <meta http-equiv="expires" content="-1" />
    <title><%# Page.Title %></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css" />
    <link rel="stylesheet" href="Css/Site.css" type="text/css"/>
    <link href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    
    <style type="text/css">
                
        form > .container{
        padding:0px; /*override*/
        }

        .form-control {
        display: inline-block;
        width: 75%;
        }

        #lblEmail {
            margin-top: 15px;
            padding-left: 25px;
        }

    </style>
</head>
<body>
    <form id="AccessCodeForm" runat="server">
    <div class="container-fluid">
        <!-- Header Section -->
        <div class ="navbar-header">
            <img src="Images/header_lefttop.jpg" alt="header left image" /><img src="Images/header_topright.jpg" alt="header right image" />
        </div><br /><br /><br />
        <!-- Main Content -->
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
            <img src="Images/homepage_leftbar.gif" alt="sidebar image" />
        </div>
        
        <div class="col-xs-7 col-sm-6 col-md-5 col-lg-4">            
            <div class="row">
                <label id="access-code-title">PharmaCertify Account Activation - Training Center</label><br />
                <p>Since this is your first time logging in, we sent you an email containing your Personal Access Code for verification purposes.  (Please check your INBOX and JUNK mail folders.) Once you’ve received it, please enter the Code in the corresponding box below to verify and activate your account.  You can only do this once.  In addition, please select a new, unique password of at least 4 characters.  Write this password down. You will use it to log in from now on.</p>  
            </div><br />
            <div class="row">
                <asp:Label ID="lblAccessCodeError" runat="server" CssClass="errorMessage" Text="" />
            </div>
            <div class="row">
                <div class="login-controls">                    
                    <label id="lblAccessCodeEmail" class="label-normal-weight">Email:</label>
                    <asp:TextBox name="txtEmail" size="19" ID="txtEmail" runat="server" CssClass="form-control"></asp:TextBox><br />
                    <label id="lblAccessCodePassword" class="label-normal-weight">Choose Password:</label>
                    <asp:TextBox name="Password" size="19" ID="txtPassword" runat="server" CssClass="form-control" TextMode="Password"></asp:TextBox><br />
                    <label id="lblPasswordConfirmation" class="label-normal-weight">Retype Password:</label>
                    <asp:TextBox name="PasswordConfirmation" size="19" ID="txtPasswordConfirmation" runat="server" CssClass="form-control" TextMode="Password"></asp:TextBox><br />
                    <label id="lblAccessCode" class="label-normal-weight">Access Code:</label>
                    <asp:TextBox name="AccessCode" size="19" ID="txtAccessCode" runat="server" CssClass="form-control"></asp:TextBox>
                    <asp:Button ID="btnAccessCodeSubmit" runat="server" CssClass="btn btn-primary btn-sm form-control" Text="Submit" OnClick="btnSubmit_Click" />
                </div>
            </div>            
        </div>        
    </div>
        <!-- Footer Section -->
        <div id="footer" class="navbar navbar-default navbar-fixed-bottom">
            <div class="container">
                <div class="col-md-6">Powered by i-prism EZ-LMS</div>
                <div class="col-md-6 text-right">&copy; 2003-2016, NXLevel Solutions, Inc.</div>
            </div>
        </div>
    </form>
</body>
</html>
