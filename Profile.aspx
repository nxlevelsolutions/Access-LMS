<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Profile.aspx.cs" Inherits="NXLevel.LMS.Profile" %>
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
            $('#Pwd1').attr('type', 'password');
            $('#passwordToggle1').click(function () { //setup eye
                if ($('#Pwd1').attr('type') == 'password') {
                    $('#Pwd1').attr('type', 'text');
                } else {
                    $('#Pwd1').attr('type', 'password');
                }
            });
            $('#Pwd2').attr('type', 'password');
            $('#passwordToggle2').click(function () { //setup eye
                if ($('#Pwd2').attr('type') == 'password') {
                    $('#Pwd2').attr('type', 'text');
                } else {
                    $('#Pwd2').attr('type', 'password');
                }
            });
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="glyphicon glyphicon-cog"></span> <%= GetLocalResourceObject("PageTitle")%></h3>
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


                                <p><%= GetLocalResourceObject("LabelEmail")%>:</p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <span class="glyphicon glyphicon-envelope"></span>
                                            </td>
                                        <td>
                                            <asp:TextBox size="19" ID="Email" runat="server" CssClass="form-control" ReadOnly="true"></asp:TextBox></td>
                                    </tr>
                                </table>


                                <br />
                                <p><%= GetLocalResourceObject("LabelFirstName")%></p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_username.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Email" size="19" ID="FName" runat="server" CssClass="form-control"  required autofocus></asp:TextBox></td>
                                    </tr>
                                </table>

                                <br />
                                <p><%= GetLocalResourceObject("LabelLastName")%></p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_username.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Email" size="19" ID="LName" runat="server" CssClass="form-control"  required></asp:TextBox></td>
                                    </tr>
                                </table>


                                <br />
                                <!--password1-->
                                <p><%= GetLocalResourceObject("LabelEnterPwd1")%></p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_lock.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Pwd1" size="19" ID="Pwd1" runat="server" CssClass="form-control" ClientIDMode="Static" required></asp:TextBox>
                                            <span id="passwordToggle1" class="fa fa-eye password-toggle" aria-hidden="true"></span>
                                        </td>
                                    </tr>
                                </table>


                                <br />
                                <!--password2-->
                                <p><%= GetLocalResourceObject("LabelEnterPwd2")%></p>
                                <table width="100%">
                                    <tr>
                                        <td width="30" bgcolor="#d9edf7" align="center">
                                            <img src="images/icon_lock.svg" width="15" /></td>
                                        <td>
                                            <asp:TextBox name="Pwd2" size="19" ID="Pwd2" runat="server" CssClass="form-control" ClientIDMode="Static" required></asp:TextBox>
                                            <span id="passwordToggle2" class="fa fa-eye password-toggle" aria-hidden="true"></span>
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <asp:Button ID="btnSubmit" runat="server" CssClass="btn btn-primary form-control" Text="<%$ Resources:Global, BtnSave %>" OnClick="btnSubmit_Click" />
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
