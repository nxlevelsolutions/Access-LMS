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

 
</script>

<ul class="pagination">
    <li class="<% =(PageIndex==1 ? "disabled": "") %>">
        <asp:LinkButton ID="PreviousPage" runat="server" OnClientClick="$('#PagerClickedIndex').val(Number($('#PagerClickedIndex').val()) - 1);"><span aria-hidden="true">&laquo;</span></asp:LinkButton>
    </li>
    <asp:Repeater ID="RptPages" runat="server">
        <ItemTemplate>
            <li class="<%# ((int)Container.DataItem)==PageIndex ? "active": "" %>">
                <asp:LinkButton ID="hplPageUrl" runat="server" OnClientClick="$('#PagerClickedIndex').val(this.innerHTML);"><%# Container.DataItem %></asp:LinkButton>
            </li>
        </ItemTemplate>
    </asp:Repeater>
    <li class="<% =(PageIndex==PageTotal ? "disabled": "") %>">
        <asp:LinkButton ID="NextPage" runat="server" OnClientClick="$('#PagerClickedIndex').val(Number($('#PagerClickedIndex').val()) + 1);" ><span aria-hidden="true">&raquo;</span></asp:LinkButton>
    </li>
</ul>
<asp:HiddenField ID="PagerClickedIndex" runat="server" ClientIDMode="Static" Value="<%# PageIndex %>"/>

&nbsp;&nbsp;Items per page:
<asp:DropDownList ID="ddlPageSize" runat="server" ClientIDMode="Static" AutoPostBack="true">
    <asp:ListItem Text="10" Value="10" />
    <asp:ListItem Text="25" Value="25" />
    <asp:ListItem Text="50" Value="50" />
</asp:DropDownList>  (<% =RecordCount %> total records)
