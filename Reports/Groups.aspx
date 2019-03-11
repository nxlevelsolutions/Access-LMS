<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Groups.aspx.cs" Inherits="NXLevel.LMS.Reports.Groups" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li class="active">Groups</li>
    </ol>

    <p align="right">
        <asp:LinkButton runat="server" ID="lnkDownload" Text="" OnClick="lnkDownload_Click"><span class="fa fa-download"></span> Download Excel report</asp:LinkButton>
    </p>

    <asp:Repeater ID="rptCategories" runat="server">
        <ItemTemplate>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4>Category: <%# Eval("title") %></h4>
                </div>
                <asp:Repeater ID="rptGroups" runat="server" DataSource='<%# GetGroups((int)Eval("categoryId")) %>'>
                    <HeaderTemplate>
                        <table class="table evenrowcolor" id="usersList">
                            <tr>
                                <th>Group</th>
                                <th class="text-center" width="20%">Group members</th>
                                <th class="text-center" width="20%">Average score</th>
                            </tr>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <tr>
                            <td><a href='group.aspx?gId=<%# Eval("groupId") %>&title=<%# Server.UrlEncode((string)Eval("title")) %>'><%# Eval("title") %></a></td>
                            <td align="center"><%# Eval("userCount") %></td>
                            <td align="center"> 
                                <%# Eval("avgScore", "{0:F2}%") %>
                            </td>
                        </tr>
                    </ItemTemplate>
                    <FooterTemplate>
                        </table>
                    </FooterTemplate>
                </asp:Repeater>
            </div>
            <hr />
        </ItemTemplate>
    </asp:Repeater>

</asp:Content>
