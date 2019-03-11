<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="Breadcrumbs.ascx.cs" Inherits="NXLevel.LMS.Controls.Breadcrumbs" %>
<div class="breadcrumb">
    <asp:SiteMapPath ID="SiteMap1" 
        runat="server"
        PathSeparator=" / " 
        ParentLevelsDisplayed="1" 
        PathDirection="RootToCurrent"
        ShowToolTips="true">
        <CurrentNodeStyle CssClass="current-node"></CurrentNodeStyle>
        <NodeTemplate>
            <li>
                <asp:HyperLink
                    id="lnkPage"
                    Text='<%# Eval("Title") %>'
                    NavigateUrl='<%# Eval("Url") %>'
                    ToolTip='<%# Eval("Description") %>'
                    Runat="server"
                 />
            </li>
        </NodeTemplate>
    </asp:SiteMapPath>
</div>