<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="GroupAssignmentEditor.aspx.cs" Inherits="NXLevel.LMS.Admin.GroupAssignmentEditor" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script>
        function onSave() {
            Utils.Post("GroupAssignmentEditor.aspx/SaveUsers",
                {
                    userIds: $('#cbUsers input:checked').map(function(){ return this.value }).get().toString()
                },
                function (response) {
                    parent.window.closeWin(true); 
                }
            );
        }

        function selectAllUsers() {
            $("input[type=checkbox]:visible").prop("checked", true)
        }

        $(document).ready(function () {
            var items = $("#cbUsers label");
            document.getElementById("searchBox").onkeyup = function () {
                var search = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
                if (search.length == 0) { //show all
                    items.each(function (index, value) {
                        $(this).parent().show();
                    });
                    $('#no-results').hide();
                }
                else {
                    var found = false,
                        jCtrl,
                        text;
                    items.each(function (index, ctrl) {
                        jCtrl = $(this);
                        text = jCtrl.text().replace(/\s+/g, ' ').toLowerCase();
                        if (text.indexOf(search) == -1) {
                            jCtrl.parent().hide();
                        }
                        else {
                            jCtrl.parent().show();
                            found = true;
                        }
                    });
                    if (found)
                        $('#no-results').hide();
                    else
                        $('#no-results').show();
                }
            }
        });
    </script>
    <style type="text/css">
        body{
            overflow-y: scroll;
        }
        #search{
            position:fixed;
            background-color: #fff;
            border-bottom: solid 1px #999;
        }
        #cbUsers{
            margin-top: 65px;
        }
         
    </style>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    
    <table id="search" align="center" width="90%">
        <tr>
            <td width="55">Search:</td>
            <td><input id="searchBox" type="text" value="" placeholder="Enter search term" /></td>
        </tr>
        <tr>
            <td colspan="2">
                <div style="height:10px;"></div>
                <input type="checkbox" id="selectAll" class="btn" onclick="this.checked && selectAllUsers()" style="margin-bottom: 5px;" /><label for="selectAll">Select all</label>
            </td>
        </tr>
    </table>

    <asp:CheckBoxList ID="cbUsers" runat="server" ClientIDMode="Static" DataValueField="userId" DataTextField="NameDisplay" RepeatColumns="1" Width="100%"></asp:CheckBoxList>
    <div id="no-results" class="collapse">No names match your search.</div>

</asp:Content>
