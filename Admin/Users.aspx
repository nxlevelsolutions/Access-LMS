<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="NXLevel.LMS.Admin.Users" %>
<%@ Register src="../Controls/Pager.ascx" tagname="Pager" tagprefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">

    <script language="javascript">
        $(document).ready(function () {
            $('#usersList tr:odd').addClass('row-highlight');
        });
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h4>Users Administration</h4>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <button type="button" class="btn btn-md btn-primary" onclick='isQuizEditable(<%# Eval("userId") %>, 1)'>ADD USER</button>
        </div>
        <asp:Repeater ID="UsersList" runat="server">
            <HeaderTemplate>
                <table class="table" id="usersList">
                    <tr>
                        <th>Last name</th>
                        <th>First name</th>
                        <th>Email</th>
                        <th class="text-center">Assigned Courses</th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><a onclick='alert(<%# Eval("userId") %>)'><%# Eval("lastName") %></a></td>
                    <td><a onclick='alert(<%# Eval("userId") %>)'><%# Eval("firstName") %></a></td>
                    <td><a onclick='alert(<%# Eval("userId") %>)'><%# Eval("email") %></a></td>
                    <td align="center"><a onclick='alert(<%# Eval("userId") %>)'>EDIT</a></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>

    </div>

    <uc1:Pager ID="UsersPager" runat="server" PageSize="10" />


</asp:Content>
