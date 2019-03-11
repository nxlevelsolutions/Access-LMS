<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="AssignmentGroups.aspx.cs" Inherits="NXLevel.LMS.Admin.AssignmentGroups" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script>
        function onSave() {
            Utils.Post("AssignmentGroups.aspx/SaveGroups",
                {
                    groupIds: $('#cbGroups input:checked').map(function(){ return this.value }).get().toString()
                },
                function (response) {
                    parent.window.closeWin(true); 
                }
            );
        }
    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:CheckBoxList ID="cbGroups" runat="server" ClientIDMode="Static" DataValueField="groupId" DataTextField="title" RepeatColumns="1" Width="100%"></asp:CheckBoxList>
    <asp:Literal runat="server" ID="litNoResult">No groups available.</asp:Literal>
</asp:Content>
