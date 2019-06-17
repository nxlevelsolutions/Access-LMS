<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReadAndSign.aspx.cs" Inherits="NXLevel.LMS.courses.ReadAndSign" %>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />
    <link rel="stylesheet" href="../css/site.css" type="text/css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
    <script language="javascript" src="../js/utils.js"></script>
    <script language="javascript" src="../js/scorm.js"></script>
    <script>
        var assigId,
            courseId,
            userId;

        function assetClicked() {
            document.forms[0].target = '_blank';
            document.getElementById("btnAccept").disabled = false;
        }
        function acceptClicked() {
            document.forms[0].target = '';
            if (userId && courseId && assigId) {
                API.LMSSetValue("cmi.core.lesson_status", "completed")
                parent.lms.refreshDisplay(assigId, courseId);
            }
        }
        function loadCourse() {
            userId = Utils.getQueryVariable("uid");
            assigId = Utils.getQueryVariable("aid");
            courseId = Utils.getQueryVariable("cid");
            if (userId && courseId && assigId) {
                API.loadInitData(userId, assigId, courseId, "../", function (ret) {
                    parent.lms.refreshDisplay(assigId, courseId);
                });
            }
        }
    </script>
</head>
<body onload="loadCourse()">
    <form id="form1" runat="server">
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p align="center">
            <asp:LinkButton ID="lnkViewAsset" runat="server" CssClass="fas fa-file-alt fa-8x" OnClick="lnkViewAsset_Click" OnClientClick="assetClicked()"></asp:LinkButton>
        </p>
        <div style="width:80%;margin:0 auto;text-align:center;"><asp:Label ID="lblInstructions" runat="server"></asp:Label></div>
        <p>&nbsp;</p>
        <p align="center"><asp:Button ID="btnAccept" runat="server" Text="Accept" CssClass="btn btn-primary btn-lg" OnClick="btnAccept_Click" ClientIDMode="Static" OnClientClick="acceptClicked()" /></p>
        <p align="center"><asp:Label ID="lblThankYou" runat="server" Text="Thank you. Your response has been recorded." Visible="false" Font-Bold="True"></asp:Label></p>
    </form>
</body>
</html>
