<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="AssignmentCourses.aspx.cs" Inherits="NXLevel.LMS.Admin.AssignmentCourses" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <script>
        function onSave() {
            Utils.Post("AssignmentCourses.aspx/SaveCourses",
                {
                    courseIds: $('#choices-container input:checked').map(function () { return this.value }).get().toString(),
                    availInOrder: document.getElementById('cbAvailableInOrder').checked
                },
                function (response) {
                    parent.window.closeWin(true); 
                }
            );
        }

        function setSequence(ctrl) {
            if (ctrl.checked) {
                $('.choice-drag').fadeIn();
                $('.order').fadeIn();
            }
            else {
                $('.choice-drag').hide();
                $('.order').hide();
            }
        }

        function reorder() {
            var i = 1;
            $('#choices-container table tr').each(function (index, tr) {
                tr = $(tr);
                ctrl = tr.find('input')[0];
                ordr = tr.find('.order');
                if (ctrl.checked) {
                    ordr.html(i + ')');
                    i++;
                }
                else {
                    ordr.html('');
                }
            });
        }

        $(function () {
            $("#drag-container").sortable({
                handle: '.choice-drag',
                update: function (event, ui) {
                    reorder();
                }
            });
            reorder()
            setSequence(document.getElementById('cbAvailableInOrder'));
            $('[data-toggle="tooltip"]').tooltip();
        });
    </script>
    <style type="text/css">
        body{
            overflow-y: auto;
        }
        #options{
            position:fixed;
            background-color: #fff;
            border-bottom: solid 1px #999;
        }
        #choices-container{
            margin-top: 90px;
        }
		.choice-drag{
			display:inline-block;
			width: 40px;
			background-color: #C8FABC;
		}        
        /*bootstrap overrides*/
        label {
            margin-left: 0px;
        }
        .table>tbody>tr>td{
            border-top: 0px;
        }
 
    </style>

</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <table id="options" align="center" width="95%">
        <tr>
            <td valign="top" width="20">
                <asp:CheckBox runat="server" ID="cbAvailableInOrder" ClientIDMode="Static" onclick="setSequence(this)" />
            </td>
            <td>
                <label 
                    for="cbAvailableInOrder"
                    data-toggle="tooltip" 
                    data-placement="right" 
                    title="If checked, a course will become available only when the previous course is completed/passed. The 1st course is always available. If it is not checked, all selected courses will be available at once.">Make courses available in sequence</label>
            </td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td></td>
        </tr>
    </table>

    <div id="choices-container">
        <table align="center" class="table table-striped">
            <tbody id="drag-container">
            <asp:Repeater runat="server" ID="rptCourses" ClientIDMode="Static">
                <ItemTemplate>
                    <tr>
                        <td width="20" class="order" align="center"></td>
                        <td width="20"><input type="checkbox" value="<%# Eval("courseId") %>" <%# (bool)Eval("isInAssignment")==true?"checked":"" %>  onclick="reorder()" /></td>
                        <td width="420" class='<%# (bool)Eval("enabled") ? "": "disabled" %>' >
                            <span 
                                data-toggle="tooltip" 
                                data-placement="right" 
                                title="You may select any course to this Learning Plan, however disabled courses (in gray) will not be available to users until they're enabled (in black).">
                                <%# Eval("title") %>
                            </span>
                        </td>
                        <td width="50" align="center">
                            <div class="choice-drag pointer" title="Drag choice up or down"><span class="fa fa-chevron-down"></span> <span class="fa fa-chevron-up"></span></div>
                        </td>
                    </tr>
                </ItemTemplate>
            </asp:Repeater>
            </tbody>
        </table>
    </div>
    <%--<asp:CheckBoxList ID="cbCourses" runat="server" ClientIDMode="Static" DataValueField="courseId" DataTextField="title" RepeatColumns="1" Width="100%"></asp:CheckBoxList>--%>
    <asp:Literal runat="server" ID="litNoResult">No courses available.</asp:Literal>
</asp:Content>
