<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="NXLevel.LMS.Reports.Users" %>
<%@ Register src="../Controls/Pager.ascx" tagname="Pager" tagprefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
<script>

    function sortToggleColum(columnIndex) {
        //columnIndex must be > 0
        var lastCol = Utils.getQueryVariable('<% =SORT_KEY %>');
        if (lastCol == undefined) {
            columnIndex *= -1;
        }
        else {
            if (Math.abs(Number(lastCol)) === columnIndex) {
                columnIndex = -1 * Number(lastCol);
            }
            else {
                columnIndex *= -1;
            }
        }
        document.location.href = Utils.setQueryVariable({<% =SORT_KEY %>: columnIndex });
    }

</script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li class="active">All users</li>
    </ol>

    <div class="panel panel-default">
        <div class="panel-heading">
            <table width="100%">
                <tr>
                    <td></td>
                    <td align="right"> 
                        <asp:LinkButton runat="server" ID="lnkDownload" Text="" OnClick="lnkDownload_Click"><span class="fa fa-download"></span> Download Excel report</asp:LinkButton>
                    </td>
                </tr>
            </table>
        </div>
            <asp:Repeater ID="rptUsers" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor" id="usersList">
                    <tr>
                        <th>Last name <span class="icon-sort" onclick="sortToggleColum(2)"></span></th>
                        <th>First name <span class="icon-sort" onclick="sortToggleColum(1)"></span></th>
                        <th>Email</th>
                        <th class="text-center"># Assignments</th>
                        <th class="text-center"># Completed</th>
                        <th class="text-center">% Average score</th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td><a href='UserCourses.aspx?uid=<%# Eval("userId") %>&fn=<%# Eval("firstName") %>&ln=<%# Eval("lastName") %>'><%# Eval("lastName") %></a></td>
                    <td><a href='UserCourses.aspx?uid=<%# Eval("userId") %>&fn=<%# Eval("firstName") %>&ln=<%# Eval("lastName") %>'><%# Eval("firstName") %></a></td>
                    <td><a href='UserCourses.aspx?uid=<%# Eval("userId") %>&fn=<%# Eval("firstName") %>&ln=<%# Eval("lastName") %>'><%# Eval("email") %></a></td>
                    <td align="center"><%# Eval("coursesCount") %></td>
                    <td align="center"><%# Eval("completedCount") %></td>
                    <td align="center"><%# Eval("avgScore", "{0:F2}%") %></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
        
    </div>

    <uc1:Pager ID="UsersPager" runat="server" PageSize="10" />

</asp:Content>
