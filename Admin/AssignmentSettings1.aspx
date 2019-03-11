<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="AssignmentSettings1.aspx.cs" Inherits="NXLevel.LMS.Admin.AssignmentSettings1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script>

        $(document).ready(function () {
            $("#txtDuedate").datepicker();
            $('[data-toggle="tooltip"]').tooltip();
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <div id="errMessage" class="required-red"></div>
    
    <div class="tab-content">
        <p>&nbsp;</p>
        <table width="100%">
            <tr>
                <td valign="top">Course:</td>
                <td>
                    <asp:DropDownList ID="ddlCourses" runat="server" AppendDataBoundItems="true">
                        <asp:ListItem Text="- Select course -" Value=""></asp:ListItem>
                    </asp:DropDownList>
                </td>
            </tr>
            <tr>
                <td width="100" height="33" valign="top">Name:</td>
                <td><asp:TextBox ID="txtTitle" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td valign="top">Description:</td>
                <td><asp:TextBox ID="txtDescription" runat="server" TextMode="MultiLine"></asp:TextBox></td>
            </tr>
        </table>

        <table class="table">
            <tr>
                <td>
                    <table width="100%">
                        <tr>
                            <td width="50%"><asp:CheckBox runat="server" ID="cbEnabled" Text="Enable this activity" ClientIDMode="Static" /></td>
                            <td align="right">
                                Due date:
                                <asp:TextBox runat="server" ID="txtDuedate" placeholder="mm/dd/yyyy" CssClass="text-center" ClientIDMode="Static" Width="82" onchange="checkDate(this)"></asp:TextBox>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <asp:CheckBox runat="server" ID="cbEmailOnAssigned" Text='Send "assigned activity" reminder email' ClientIDMode="Static"  />
                </td>
            </tr>
            <tr>
                <td>
                    <asp:CheckBox runat="server" ID="cbEmailPeriodic" Text="Send periodic reminders emails" ClientIDMode="Static" onclick="enablePeriodicDays(this)" />
                    every <asp:TextBox runat="server" ID="txtPeriodicDays" ClientIDMode="Static" Width="25" CssClass="text-center"></asp:TextBox> day(s).
                </td>
            </tr>
            <tr>
                <td>
                    <asp:CheckBox runat="server" ID="cbEmailNearDueDate" Text='Send "near" due date reminder email' ClientIDMode="Static" onclick="enableNearDueDays(this)" />
                    <asp:TextBox runat="server" ID="txtNearDueDateDays" ClientIDMode="Static" Width="25" CssClass="text-center"></asp:TextBox> day(s) before the due date.
                </td>
            </tr>
            <tr>
                <td>
                    <asp:CheckBox runat="server" ID="cbEmailDueDate" Text='Send "on due date" reminder email' ClientIDMode="Static"  />
                </td>
            </tr>
            <tr>
                <td>
                    <asp:CheckBox runat="server" ID="cbEmailOverdue" Text='Send "overdue" reminder email' ClientIDMode="Static"  />
                </td>
            </tr>

        </table>

         

    </div>

</asp:Content>
