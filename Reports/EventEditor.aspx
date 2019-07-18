<%@ Page Title="" Language="C#" MasterPageFile="~/Basic.Master" AutoEventWireup="true" CodeBehind="EventEditor.aspx.cs" Inherits="NXLevel.LMS.Reports.EventEditor" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">

    <style type="text/css">
        .enabledColor {
            color: #525252;
        }
    </style>

    <script type="text/javascript">
        function onSave() {
            var isScoreType = document.getElementById("RBScoreType").checked;
            Utils.Post("EventEditor.aspx/Save",
                {
                    isScoreType: isScoreType,
                    score: $('#TxtScore').val() == "" ? null : $('#TxtScore').val(),
                    scoreDate: $('#TxtTimestamp').val(),
                    startDate: $('#TxtStartedDate').val(),
                    endDate: $('#TxtCompletedDate').val()
                },
                function (response) {
                    if (response.error) {
                        alert(response.error);
                        parent.window.enableSave();
                    }
                    else {
                        parent.window.closeWin(true);
                    }
                }
            );
        }

        function selectType() {
            var ctrl = document.getElementById("RBScoreType");
            if (ctrl.checked) {
                $('#datesTable').addClass("disabled");
                $('#scoreTable').removeClass("disabled");
                //disabled dates
                $('#TxtScore').prop("disabled", false); $('#TxtScore').focus();
                $('#TxtTimestamp').prop("disabled", false);
                $('#TxtStartedDate').prop("disabled", true); $('#TxtStartedDate').val("");
                $('#TxtCompletedDate').prop("disabled", true); $('#TxtCompletedDate').val("");

                if ($('#datesTable').find("input[type=radio][disabled]").length == 0) $('#datesTable').find("label").addClass("enabledColor");
            }
            else {
                $('#datesTable').removeClass("disabled");
                $('#scoreTable').addClass("disabled");
                //disable score
                $('#TxtScore').prop("disabled", true); $('#TxtScore').val("");
                $('#TxtTimestamp').prop("disabled", true); $('#TxtTimestamp').val("");
                $('#TxtStartedDate').prop("disabled", false); $('#TxtStartedDate').focus();
                $('#TxtCompletedDate').prop("disabled", false);

                if ($('#scoreTable').find("input[type=radio][disabled]").length == 0) $('#scoreTable').find("label").addClass("enabledColor");
            }
        }

        $(document).ready(function () {
            selectType();
        });

    </script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">

    <table width="100%" id="scoreTable">
        <tr>
            <td><asp:RadioButton ID="RBScoreType" runat="server" ClientIDMode="Static" onchange="selectType()" GroupName="eventType" /></td>
            <td><label for="RBScoreType"><b>Score event:</b></label></td>
        </tr>
        <tr>
            <td></td>
            <td>
                <table class="table" width="100%" >
                    <tr>
                        <td width="50%">Score:</td>
                        <td><asp:TextBox ID="TxtScore" runat="server" ClientIDMode="Static" placeholder="##.##"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td>Date/Time:<br /><span class="small">(Leave empty for current date/time)</span>
                        </td>
                        <td><asp:TextBox ID="TxtTimestamp" runat="server" ClientIDMode="Static" placeholder="MM/DD/YYYY HH:MM:SS AM/PM"></asp:TextBox></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <table width="100%" id="datesTable">
        <tr>
            <td><asp:RadioButton ID="RBDateType" runat="server" ClientIDMode="Static" onchange="selectType()" GroupName="eventType" /></td>
            <td><label for="RBDateType"><b>Started/completed event:</b></label></td>
        </tr>
        <tr>
            <td></td>
            <td>
                <table class="table" width="100%" >
                    <tr>
                        <td width="50%">Started:</td>
                        <td><asp:TextBox ID="TxtStartedDate" runat="server" ClientIDMode="Static" placeholder="MM/DD/YYYY HH:MM:SS AM/PM"></asp:TextBox></td>
                    </tr>
                    <tr>
                        <td>Completed:</td>
                        <td><asp:TextBox ID="TxtCompletedDate" runat="server" ClientIDMode="Static" placeholder="MM/DD/YYYY HH:MM:SS AM/PM"></asp:TextBox></td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</asp:Content>
