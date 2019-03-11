<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Assignments.aspx.cs" Inherits="NXLevel.LMS.Admin.Assignments" %>
<%@ Register src="../Controls/Pager.ascx" tagname="Pager" tagprefix="uc1" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">

    <script language="javascript">

        var popName;

        function openDialog(popupName, url) {
            popName = "#" + popupName;
            $(popName + ' iframe').attr('src', url);
            $(popName + ' #saveBtn').prop("disabled", false);
            $(popName).modal({ show: true });
        }

        function disableOK(flag) {
            if (flag == false) {
                $(popName + ' #saveBtn').prop("disabled", false);
            }
            else {
                $(popName + ' #saveBtn').prop("disabled", true);
            }
        }

        function onSave() {
            //$(popName + ' #saveBtn').prop("disabled", true);
            $(popName + ' iframe')[0].contentWindow.onSave();
        }

        function closeWin(refresh) {
            $(popName).on("hidden.bs.modal", function () {
                if (refresh) document.location.href = document.location.href;
            });
            $(popName).modal("hide");
        }

        function confirmDelete(aId) {
            $('#deleteConfirmation').data("aId", aId).
                                     modal({ show: true });
        }

        function deleteItem() {
            Utils.Post("Assignments.aspx/Delete",
                {
                    assignmentId: $('#deleteConfirmation').data("aId")
                },
                function (response) {
                    document.location.href = document.location.href;
                }
            );
        }

        $(document).ready(function () {
            $("#assignEditor").draggable({ handle: ".modal-header" });
            $("#assignUsers").draggable({ handle: ".modal-header" });
            $("#assignGroups").draggable({ handle: ".modal-header" });
            $("#assignCourses").draggable({ handle: ".modal-header" });
            $("#lpSettings").draggable({ handle: ".modal-header" });
            $("#asgSettings").draggable({ handle: ".modal-header" });
            $("#deleteConfirmation").draggable({ handle: ".modal-header" });
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="page-header">
        <h3><span class="fa fa-gg"></span> Activities</h3>
    </div>


    <ul class="nav nav-tabs" >
        <li class="active"><a href="#tab1" data-toggle="tab">Assignments</a></li>
        <li><a href="#tab2" data-toggle="tab">Learning Plans</a></li>
    </ul>


    <div class="tab-content">
        <div class="tab-pane fade in active" id="tab1">
            <p>&nbsp;</p>
            <!-- tab one begin -->
            <div class="panel panel-default">
                <div class="panel-heading">
                    <button type="button" class="btn btn-md btn-primary" onclick="openDialog('assignEditor', 'AssignmentEditor2.aspx')"><span class="fa fa-plus"></span> NEW ASSIGNMENT</button>
                </div>
                <asp:Repeater ID="rptAssignments1" runat="server">
                    <HeaderTemplate>
                        <table class="table evenrowcolor">
                            <tr>
                                <th>Course Title</th>
                                <th class="text-center" width="12%">Enabled</th>
                                <th class="text-center" width="12%">Learners</th>
                                <th class="text-center" width="12%">Groups</th>
                                <th class="text-center" width="12%">Settings</th>
                                <th class="text-center" width="5%"></th>
                            </tr>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <tr class="<%# (bool)Eval("enabled")==true ? "": "disabled" %>">
                            <td><a onclick="openDialog('assignEditor', 'AssignmentEditor.aspx?aid=<%# Eval("assignmentId") %>')" ><%# Eval("title") %></a></td>
                            <td align="center"><%# ((bool?)Eval("enabled")==true?"Yes": "No") %></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('assignUsers', 'AssignmentUsers.aspx?aid=<%# Eval("assignmentId") %>')">Total: <%# Eval("userCount") %> &nbsp; <span class="fa fa-edit"></span></button></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('assignGroups', 'AssignmentGroups.aspx?aid=<%# Eval("assignmentId") %>')">Total: <%# Eval("groupCount") %> &nbsp;<span class="fa fa-edit"></span></button></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('asgSettings', 'AssignmentSettings1.aspx?aid=<%# Eval("assignmentId") %>')"><span class="fa fa-cog"></span></button></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary btn-warning" onclick="confirmDelete(<%# Eval("assignmentId") %>)"><span class="fa fa-trash"></span></button></td>
                        </tr>
                    </ItemTemplate>
                    <FooterTemplate>
                        </table>
                    </FooterTemplate>
                </asp:Repeater>
            </div>
            <!-- tab one end -->
        </div>
        <div class="tab-pane fade" id="tab2">
            <p>&nbsp;</p>
            <!-- tab two begin -->
            <div class="panel panel-default">
                <div class="panel-heading">
                    <button type="button" class="btn btn-md btn-primary" onclick="openDialog('assignEditor', 'AssignmentEditor1.aspx')"><span class="fa fa-plus"></span> NEW LEARNING PLAN</button>
                </div>
                <asp:Repeater ID="rptAssignments2" runat="server">
                    <HeaderTemplate>
                        <table class="table evenrowcolor">
                            <tr>
                                <th>Title</th>
                                <th class="text-center" width="12%">Enabled</th>
                                <th class="text-center" width="12%">Learners</th>
                                <th class="text-center" width="12%">Groups</th>
                                <th class="text-center" width="12%">Courses</th>
                                <th class="text-center" width="12%">Settings</th>
                                <th class="text-center" width="5%"></th>
                            </tr>
                    </HeaderTemplate>
                    <ItemTemplate>
                        <tr class="<%# (bool)Eval("enabled")==true ? "": "disabled" %>">
                            <td><a onclick="openDialog('assignEditor', 'AssignmentEditor.aspx?aid=<%# Eval("assignmentId") %>')" ><%# Eval("title") %></a></td>
                            <td align="center"><%# ((bool?)Eval("enabled")==true?"Yes": "No") %></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('assignUsers', 'AssignmentUsers.aspx?aid=<%# Eval("assignmentId") %>')">Total: <%# Eval("userCount") %> &nbsp; <span class="fa fa-edit"></span></button></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('assignGroups', 'AssignmentGroups.aspx?aid=<%# Eval("assignmentId") %>')">Total: <%# Eval("groupCount") %> &nbsp;<span class="fa fa-edit"></span></button></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('assignCourses', 'AssignmentCourses.aspx?aid=<%# Eval("assignmentId") %>')">Total: <%# Eval("courseCount") %> &nbsp;<span class="fa fa-edit"></span></button></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('lpSettings', 'AssignmentSettings2.aspx?aid=<%# Eval("assignmentId") %>')"><span class="fa fa-cog"></span></button></td>
                            <td align="center"><button type="button" class="btn btn-md btn-primary btn-warning" onclick="confirmDelete(<%# Eval("assignmentId") %>)"><span class="fa fa-trash"></span></button></td>
                        </tr>
                    </ItemTemplate>
                    <FooterTemplate>
                        </table>
                    </FooterTemplate>
                </asp:Repeater>
            </div>
            <!-- tab two end -->
        </div>
    </div>


    
     
    <!-- add/edit assignments modal -->
    <div id="assignEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Learning Plan</h3>
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
 
    <!-- add/edit assignments users  -->
    <div id="assignUsers" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Learners</h3>
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

    <!-- add/edit assignments groups  -->
    <div id="assignGroups" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Category / Groups</h3>
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

    <!-- add/edit assignments courses  -->
    <div id="assignCourses" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Learning Plan: Courses</h3>
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

    <!-- add/edit assignments settings  -->
    <div id="asgSettings" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Activity Settings</h3>
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

    <!-- add/edit learning plan settings  -->
    <div id="lpSettings" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Learning Plan: Settings</h3>
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

    <!-- delete asssignment modal -->
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
                                    <p>Deleting this activity will not delete any learners or their data, however they will lose 
                                        access to any course(s) associated with it.
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
