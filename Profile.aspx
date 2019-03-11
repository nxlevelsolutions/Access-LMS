<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Profile.aspx.cs" Inherits="NXLevel.LMS.Profile" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h4>My Account</h4>
    </div>

    <div class="panel panel-default">
        <div class="panel-body">

            <div class="row" style="background-color: #f1f7fd; border-radius: 10px; margin: 0px">

                <div class="col-md-1 hidden-xs">
                    &nbsp;
                </div>
                <div class="col-md-5">

                    <table width="100%">
                        <tr>
                            <td>
                                <br />
                                <asp:Label ID="Msg" Visible="false" runat="server" CssClass="alert alert-danger btn-block" role="alert" Text="" />

                                <p>First name:</p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_username.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Email" size="19" ID="FName" runat="server" CssClass="form-control" placeholder="Enter your first name" required autofocus></asp:TextBox></td>
                                    </tr>
                                </table>

                                <br />
                                <p>Last name:</p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_username.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Email" size="19" ID="LName" runat="server" CssClass="form-control" placeholder="Enter your last name" required></asp:TextBox></td>
                                    </tr>
                                </table>


                                <!--password-->
                                <br />
                                <p>Enter your new password:</p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_lock.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Pwd1" size="19" ID="Pwd1" runat="server" CssClass="form-control" placeholder="Password" required></asp:TextBox></td>
                                    </tr>
                                </table>

                                <br />
                                <p>Re-enter your new password:</p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_lock.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Pwd2" size="19" ID="Pwd2" runat="server" CssClass="form-control" placeholder="Password" required></asp:TextBox></td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-primary form-control" Text="Save" OnClick="btnSubmit_Click" />
                            </td>
                        </tr>
                    </table>

                    <p>&nbsp;</p>
                </div>
                <div class="col-md-5 text-muted">
                    <p>&nbsp;</p>
                </div>
                <div class="col-md-1 hidden-xs">
                    &nbsp;
                </div>

            </div>


        </div>
    </div>



</asp:Content>
