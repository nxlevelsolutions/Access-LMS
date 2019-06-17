<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Groups.aspx.cs" Inherits="NXLevel.LMS.Admin.Groups" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <style>

       
    </style>
    <script language="javascript">

        var popName;

        function openGroupEditor(catId, groupId) {
            var qs;

            if (catId != null) qs = 'cid=' + catId;
            if (groupId != null) qs = 'gid=' + groupId;

            popName = "groupEditor";
            $('#' + popName + ' iframe').attr('src', 'GroupEditor.aspx?' + qs);
            $('#' + popName + ' #saveBtn').prop("disabled", false);
            $('#' + popName).modal({ show: true });
        }

        function openCategoryEditor(catId) {
            popName = "categoryEditor";
            $('#' + popName + ' iframe').attr('src', 'CategoryEditor.aspx' + (catId==null?'':'?cid=' + catId));
            $('#' + popName + ' #saveBtn').prop("disabled", false);
            $('#' + popName).modal({ show: true });
        }

        function openGroupAssignments(groupId, title) {

            $('#groupAssignmentEditor h3').html(title);//set popup title

            popName = "groupAssignmentEditor";
            $('#' + popName + ' iframe').attr('src', 'GroupAssignmentEditor.aspx' + (groupId==null?'':'?gid=' + groupId));
            $('#' + popName + ' #saveBtn').prop("disabled", false);
            $('#' + popName).modal({ show: true });
        }

        function confirmDelete(catId, groupId) {
            $('#deleteConfirmation').data("cid", catId).
                                     data("gid", groupId).
                                     modal({ show: true });
        }

        function deleteItem() {
            Utils.Post("Groups.aspx/DeleteItem",
                {
                    categoryId: $('#deleteConfirmation').data("cid"),
                    groupId: $('#deleteConfirmation').data("gid")
                },
                function (response) {
                    document.location.href = document.location.href;
                }
            );
        }

        function onSave() {
            $('#' + popName + ' #saveBtn').prop("disabled", true);
            $('#' + popName + ' iframe')[0].contentWindow.onSave();
            
        }

        function closeWin(refresh) {
            $('#' + popName).on("hidden.bs.modal", function () {
                if (refresh) document.location.href = document.location.href;
            });
            $('#' + popName).modal("hide");
        }

        $(document).ready(function () {
            $("#groupEditor").draggable({ handle: ".modal-header" });
            $("#categoryEditor").draggable({ handle: ".modal-header" });
            $("#groupAssignmentEditor").draggable({ handle: ".modal-header" }); 
            $("#deleteConfirmation").draggable({ handle: ".modal-header" });
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
   <div class="page-header">
    <h3><span class="fa fa-users"></span> Groups</h3>
    </div>

    <button type="button" class="btn btn-md btn-primary" onclick='openCategoryEditor(null)'><span class="fa fa-plus"></span> New group category</button>
    <br /><br />

    <asp:Repeater ID="rptCategories" runat="server">
        <ItemTemplate>
            <div class="panel panel-default">
                <div class="panel-heading">
                    <table width="100%">
                        <tr>
                            <td width="20%">
                                <button type="button" class="btn btn-md btn-primary" onclick='openGroupEditor(<%# Eval("categoryId") %>, null)'><span class="fa fa-plus"></span> New group</button>
                            </td>
                            <td align="center" width="60%">
                                 <h4 class="white-text">Category: <a class="white-text" onclick='openCategoryEditor(<%# Eval("categoryId") %>)'><%# Eval("title") %></a></h4>
                            </td>
                            <td align="right" width="20%">
                                <button type="button" class="btn btn-md btn-primary btn-warning" onclick="confirmDelete(<%# Eval("categoryId") %>, null)"><span class="fa fa-trash"></span></button>
                            </td>
                        </tr>
                    </table>
                </div>
                <asp:Repeater ID="rptGroups" runat="server" DataSource='<%# GetGroups((int)Eval("categoryId")) %>'>
                    <HeaderTemplate>
                        <table class="table evenrowcolor" id="usersList">
                            <tr>
                                <th width="25%">Title</th>
                                <th class="text-center" width="25%">Enabled</th>
                                <th class="text-center" width="25%">Add/Remove Learners</th>
                                <th class="text-center" width="25%">Delete Group</th>
                            </tr>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <tr class="<%# (bool)Eval("enabled")==true ? "": "disabled" %>">
                            <td><a onclick='openGroupEditor(null, <%# Eval("groupId") %>)'><%# Eval("title") %></a></td>
                            <td align="center"><%# (bool)Eval("enabled")==true ? "Yes": "No" %></td>
                            <td align="center"> 
                                <button type="button" class="btn btn-md btn-primary" onclick="openGroupAssignments(<%# Eval("groupId") %>, '<%# Eval("title") %>')">Total: <%# Eval("userCount") %> &nbsp;<span class="fa fa-edit"></span></button>
                            </td>
                            <td align="center"> 
                                <button type="button" class="btn btn-md btn-primary btn-warning" onclick="confirmDelete(null, <%# Eval("groupId") %>)"><span class="fa fa-trash"></span></button>
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



     

    <!-- edit group modal -->
    <div id="groupEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Group Editor</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="450px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="onSave()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- edit category modal -->
    <div id="categoryEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Category Editor</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="450px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="onSave()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- edit users in group modal -->
    <div id="groupAssignmentEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Users in Group</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <iframe src="" frameborder="0" width="100%" height="450px"></iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="onSave()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <!-- delete group/category group modal -->
    <div id="deleteConfirmation" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Delete Confirmation</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <table width="90%" align="center">
                            <tr>
                                <td >
                                    <p>Deleting this item will not delete any group members or their data, however if this item is used in
                                        a Learning Plan, then these group members may lose access to the Learning Plan's related training materials.
                                    </p>
                                    <p align="center">Are you sure you want to delete this item?</p>
                                    <p align="center">Please click OK to confirm</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="saveBtn" type="button" class="btn btn-primary" onclick="deleteItem()">OK</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>

</asp:Content>
