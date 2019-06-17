<%@ Page Title="" Language="C#" MasterPageFile="Site.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="NXLevel.LMS.Default" %>
<%@ Import Namespace="NXLevel.LMS" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div style="width: 100%; overflow: hidden;">
		<div style="width: 100%;margin-bottom: 30px; color:#d91e49">
			<h2><%= GetLocalResourceObject("PageTitle")%></h2>
		</div>
		<div style="padding-top: 0px; width: 50%; display: inline-block;vertical-align: top;">
			<%= GetLocalResourceObject("Text1")%>
		</div>
		<div style="width: 7%; display: inline-block;"></div>
		<div style="display: inline-block;">
			<%--<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="white-text"><%= LmsUser.Firstname %> <%= LmsUser.Lastname %></h4>
				</div>
				<div class="panel-body">
					<h5>Current Activities:</h5>
					<p>Good Promotional Practices &nbsp;&mdash;&nbsp; Started: 3/4/2019</p>
					<p>On-Label Promotion &nbsp;&mdash;&nbsp; Not Started</p>
					<p>Good Promotional Practices &nbsp;&mdash;&nbsp; Started: 3/4/2019</p>
					<p>&nbsp;</p>
					<h5>Recent Activities:</h5>
					<p>Compliance Overview &nbsp;&mdash;&nbsp; Completed: 3/4/2019 &nbsp;&nbsp;&nbsp;&nbsp; Score: 100</p>
					<p>&nbsp;</p>
					<p align="center"><a href="curriculum.aspx"><button type="button" class="btn btn-md btn-primary">My Curriculum</button></a></p>
				</div>
			</div>--%>
		</div>
	</div>
</asp:Content>