<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="NXLevel.LMS.Admin.Users" %>
<%@ Register src="../Controls/Pager.ascx" tagname="Pager" tagprefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script language="javascript">
        var popName;

        function openUserEditor(userId) {
            popName = "userEditor";
            $('#userEditor iframe').attr('src', 'UserEditor.aspx' + (userId==null?'':'?uid=' + userId));
            $('#userEditor #saveBtn').prop("disabled", false);
            $('#userEditor').modal({ show: true });
        }

        function disableOK(flag) {
            if (flag == false) {
                $('#' + popName + ' #saveBtn').prop("disabled", false);
            }
            else {
                $('#' + popName + ' #saveBtn').prop("disabled", true);
            }
        }

        function onSave() {
            $('#' + popName + ' iframe')[0].contentWindow.onSave();
        }

        function closeWin(refresh) {
            $('#' + popName).on("hidden.bs.modal", function () {
                if (refresh) document.location.href = document.location.href;
            });
            $('#' + popName).modal("hide");
        }

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

        $(document).ready(function () {
            $("#userEditor").draggable({ handle: ".modal-header" });
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="fa fa-user"></span> User Administration</h3>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading">
            <table width="100%">
                <tr>
                    <td><button type="button" class="btn btn-md btn-primary" onclick='openUserEditor(null)'><span class="fa fa-plus"></span> NEW USER</button></td>
                    <td align="right"><a class="white-text" href="UsersImport.aspx"><span class="fa fa-upload"></span> Roster file import</a></td>
                </tr>
            </table>
        </div>
        <table class="table evenrowcolor" id="usersList">
            <tr>
                <th>Last name <span class="icon-sort" onclick="sortToggleColum(2)"></span></th>
                <th>First name <span class="icon-sort" onclick="sortToggleColum(1)"></span></th>
                <th>Email</th>
            </tr>
            <asp:Repeater ID="rptUsers" runat="server">
            <ItemTemplate>
                <tr>
                    <td><a onclick='openUserEditor(<%# Eval("userId") %>)'><%# Eval("lastName") %></a></td>
                    <td><a onclick='openUserEditor(<%# Eval("userId") %>)'><%# Eval("firstName") %></a></td>
                    <td><a onclick='openUserEditor(<%# Eval("userId") %>)'><%# Eval("email") %></a></td>
                </tr>
            </ItemTemplate>
        </asp:Repeater>
        </table>
    </div>

    <uc1:Pager ID="UsersPager" runat="server" PageSize="10" />

    <!-- edit user modal -->
    <div id="userEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 id="addAdminLabel" class="modal-title text-center">Learner Editor</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="460px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="onSave()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
