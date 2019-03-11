<%@ Language=VBScript %>
<%
'http://msdn.microsoft.com/en-us/library/windows/desktop/ms763809(v=vs.85).aspx
option explicit
dim root, xmlhttp, comUrl, json
dim command
dim data
dim projectId
dim listId
dim assigneeId
dim todoId
dim userEmail
dim userPwd

'======================================================
' Configuration parameters
'======================================================
 const baseCampAccId = "1774729"  'NxLevel's Basecamp Account ID
 'const clientId = "194d3fd855b66b46064a81c9d3f46bfcd0e7b535"
 'const clientPwd = "8b4be10a2606d1f423b89abebebb551dc0780b62"

'======================================================
' Capture all POST browser data
'======================================================
 command    = request.form("command")
 data       = request.form("data")
 assigneeId = request.form("assigneeId")
 projectId  = request.form("projectId")
 listId     = request.form("listId")
 todoId     = request.form("todoId")
 userEmail  = request.form("userEmail")
 userPwd    = request.form("userPwd")
'======================================================

set xmlhttp = server.CreateObject("Microsoft.XMLHTTP")
root = "https://basecamp.com/" + baseCampAccId + "/api/v1/"
select case command
    case "newTodo":
        comUrl = "projects/" +projectId+ "/todolists/"+listId+ "/todos.json"  
        xmlhttp.open "post", (root + comUrl), false, userEmail, userPwd
        json = "{""content"": """+ data +""", ""due_at"": null, ""assignee"": null}"
    case "updateTodo":
        comUrl = "projects/" +projectId+ "/todos/"+todoId+ ".json"
        xmlhttp.open "put", (root + comUrl), false, userEmail, userPwd
        json = "{""content"": """+ data +""", ""due_at"": null, ""assignee"": null, ""completed"": false}"
    case "getToDos":
        comUrl = "projects/" +projectId+ "/todolists/"+listId+ ".json"
        xmlhttp.open "get", (root + comUrl), false, userEmail, userPwd
        json = ""
    case "getProjects":
        comUrl = "projects.json"
        xmlhttp.open "get", (root + comUrl), false, userEmail, userPwd
        json = ""
    case "getAssignees":
        comUrl = "people.json"
        xmlhttp.open "get", (root + comUrl), false, userEmail, userPwd
        json = ""
    case else
        response.Write("Command not undestood:" + command)
        response.End        
end select

'======================================================
' Send to basecamp and return response to browser
'======================================================
 xmlhttp.setRequestHeader "Content-Type", "application/json"
 xmlhttp.setRequestHeader "User-Agent", userEmail 'appName + " (" + userEmail + ")"
 xmlhttp.send json
 response.Write(xmlhttp.responsetext)
 set xmlhttp = nothing
'======================================================

function trace(msg)
    response.Write(msg)
    response.End
end function

%>
