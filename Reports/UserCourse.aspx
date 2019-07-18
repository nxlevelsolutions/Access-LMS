<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="UserCourse.aspx.cs" Inherits="NXLevel.LMS.Reports.UserCourse" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script type="text/javascript">

        var popName;

        function openDialog(popupName, url) {
            popName = "#" + popupName;
            $(popName + ' iframe').attr('src', url);
            $(popName + ' #saveBtn').prop("disabled", false);
            $(popName).modal({ show: true });
        }

        function onSave() {
            $(popName + ' #saveBtn').prop("disabled", true);
            $(popName + ' iframe')[0].contentWindow.onSave();
        }

        function enableSave() {
            $(popName + ' #saveBtn').prop("disabled", false);
        }

        function confirmDelete(eventType, rowId) {
            $('#deleteConfirmation')
                .data("rowId", rowId)
                .data("eventType", eventType)
                .modal({ show: true });
        }

        function deleteItem() {
            Utils.Post("UserCourse.aspx/DeleteEvent",
                {
                    rowId: $('#deleteConfirmation').data("rowId"),
                    eventType: $('#deleteConfirmation').data("eventType")
                },
                function (response) {
                    if (response.error) {
                        alert(response.error);
                    }
                    else {
                        window.location.reload();
                    }
                }
            );
        }

        function closeWin(refresh) {
            $(popName).on("hidden.bs.modal", function () {
                if (refresh) {
                    window.location.reload();
                }
            });
            $(popName).modal("hide");
        }

        $(document).ready(function () {
            $("#eventEditor").draggable({ handle: ".modal-header" });
            $("#deleteConfirmation").draggable({ handle: ".modal-header" });
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
 
    <ol class="breadcrumb">
        <li><span class="fa fa-bar-chart"></span>  <a href="Default.aspx">Reports</a></li>
        <li><a href="users.aspx">All users</a></li>
        <li><a href="usercourses.aspx?uid=<% =Request.QueryString["uid"] %>&fn=<% =Request.QueryString["fn"] %>&ln=<% =Request.QueryString["ln"] %>"><% =Request.QueryString["ln"] %>, <% =Request.QueryString["fn"] %></a></li>
        <li class="active"><% =Request.QueryString["asgTitle"] %> &mdash; <% =Request.QueryString["title"] %></li>
    </ol>

    <div class="panel panel-default">
        <div class="panel-heading">
            <table width="100%">
                <tr>
                    <td><button type="button" class="btn btn-md btn-primary" onclick="openDialog('eventEditor', 'EventEditor.aspx?st=<% =courseHasStarted?"1": "0" %>&aid=<% =Request.QueryString["aid"] %>&cid=<% =Request.QueryString["cid"] %>&uid=<% =Request.QueryString["uid"] %>')"><span class="fa fa-plus"></span> NEW EVENT</button></td>
                    <td align="right"> 
                        <asp:LinkButton runat="server" ID="lnkDownload" Text="" OnClick="lnkDownload_Click"><span class="fa fa-download"></span> Download Excel report</asp:LinkButton>
                    </td>
                </tr>
            </table>
        </div>
        
        <asp:Repeater ID="rptAttempts" runat="server">
            <HeaderTemplate>
                <table class="table evenrowcolor">
                    <tr>
                        <th class="text-center">Date/Time</th>
                        <th class="text-center">Event Info</th>
                        <th class="text-center"></th>
                        <th class="text-center"></th>
                    </tr>
            </HeaderTemplate>
            <ItemTemplate>
                <tr>
                    <td align="center"><%# Eval("dateStamp", "{0:MM/dd/yyyy hh:mm:ss tt}") %></td>
                    <td align="center"><%# Eval("eventData") %></td>
                    <td align="center"><button type="button" class="btn btn-md btn-primary" onclick="openDialog('eventEditor', 'EventEditor.aspx?et=<%# Eval("eventType") %>&rowId=<%# Eval("rowId") %>')"><span class="fa fa-cog"></span></button></td>
                    <td align="center"><button type="button" class="btn btn-md btn-primary btn-warning" onclick="confirmDelete(<%# Eval("eventType") %>, <%# Eval("rowId") %>)"><span class="fa fa-trash"></span></button></td>
                </tr>
            </ItemTemplate>
            <FooterTemplate>
                </table>
            </FooterTemplate>
        </asp:Repeater>
    </div>


    <!-- add/edit assignments courses  -->
    <div id="eventEditor" class="modal fade" role="dialog">
        <div class="modal-dialog modal-xlg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h3 class="modal-title text-center">Event Editor</h3>
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
                                    <p>Deleting this event is an irreversible step.
                                    Are you sure you want to delete this item?</p>
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
