<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Pager.ascx.cs" Inherits="NXLevel.LMS.Controls.Pager" %>
<style type="text/css">
    .pagination {
        float: left;
    }
    #ddlPageSize {
        position: relative;
        padding: 6px 12px;
        margin: 20px 0;
        color: #337ab7;
        background-color: #fff;
        border: 1px solid #ddd;
    }
</style>
<script>
    function gotoPage(index) {
        var opt = {<% = KEY_PAGE_SIZE %>: $('#ddlPageSize').val() };
        if (index != null) opt.<% = KEY_PAGE_INDEX %> = index;
        document.location.href = Utils.setQueryVariable(opt);
    }
 </script>

<ul class="pagination">
    <li class="<% =(PageIndex==1 ? "disabled": "") %>">
        <a onclick="gotoPage(<% =(PageIndex-1) %>)"><span aria-hidden="true">&laquo;</span></a>
    </li>
    <asp:Repeater ID="RptPages" runat="server">
        <ItemTemplate>
            <li class="<%# ((int)Container.DataItem)==PageIndex ? "active": "" %>">
                <a onclick="gotoPage(<%# Container.DataItem %>)" ><%# Container.DataItem %></a>
            </li>
        </ItemTemplate>
    </asp:Repeater>
    <li class="<% =(PageIndex==PageTotal ? "disabled": "") %>">
        <a onclick="gotoPage(<% =(PageIndex+1) %>)"><span aria-hidden="true">&raquo;</span></a>
    </li>
</ul>

&nbsp;&nbsp;Items per page:
<asp:DropDownList ID="ddlPageSize" runat="server" ClientIDMode="Static" onchange="gotoPage(null)">
    <asp:ListItem Text="10" Value="10" />
    <asp:ListItem Text="25" Value="25" />
    <asp:ListItem Text="50" Value="50" />
</asp:DropDownList>  (<% =RecordCount %> total records)
