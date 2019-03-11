<%
option explicit
const del = "<*>"
select case lcase(request.Form("command"))
case "getparam"
    dim r
	r = "Error=0" + VbLf _
		+ "error_text=successful" + VbLf _
		+ "version=3.5" + VbLf _
		+ "aicc_data=[core]" + VbLf _
		+ "Student_ID=B1781" + VbLf _
        + "Student_name=John Doe" + VbLf _
		+ "Output_file=" + VbLf _
		+ "Credit=C" + VbLf _
		+ "Lesson_Location=" + Session("lesson_location") + VbLf _
		+ "Lesson_Mode=Sequential" + VbLf _
		+ "Lesson_Status=" + Session("lesson_status") + VbLf _
		+ "path=" + VbLf _
		+ "Score=" + Session("score") + VbLf _
		+ "Time=" + Session("time") + VbLf _
		+ "[Core_lesson]" + VbLf _
		+ session("Core_lesson") + VbLf _
		+ "[evaluation]" + VbLf _
		+ "Course_ID=B17" + VbLf _
		+ "[Student_data] " + VbLf _
		+ "max_time_allowed=01:30:00" + VbLf _
		+ "time_limit_action=Exit" + VbLf _
        + "[Comments]" + VbLf _
        + "[Objectives_Status]" + VbLf _
        + "[Student_Preferences]" + VbLf _
	    + "Audio=" + Session("audio") + VbLf _
        + "Language=" + Session("language") + VbLf _
        + "Speed=" + Session("speed") + VbLf _
        + "Text=" + Session("text") + VbLf


	response.Write(r)
case "putparam"
	dim aicc_data
	dim res
    dim version
	aicc_data = request.form("aicc_data")
    version = request.form("version")

    session("core_lesson") = getCoreLesson()

    'reparse aicc_data for getKeyVal
	aicc_data = replace(aicc_data, VbCr, del)
	aicc_data = replace(aicc_data, VbLf, del)
	aicc_data = replace(aicc_data, del+del, del)
	session("lesson_location") = getKeyVal("lesson_location")
	Session("score") = getKeyVal("score")
	Session("time") = getKeyVal("time")
	Session("lesson_status") = getKeyVal("lesson_status")
	Session("audio") = getKeyVal("audio")
    Session("language") = getKeyVal("language")
    Session("speed") = getKeyVal("speed")
    Session("text") = getKeyVal("text")
	
	res = "Error=0" + VbLf _
		+ "error_text=Successful" + VbLf _
		+ "version=" + version + VbLf _
		+ "aicc_data=[Core]" + VbLf _
		+ "Score=" + Session("score") + VbLf _
		+ "Time=" + Session("time") + VbLf _
		+ "Lesson_location=" + session("lesson_location")  + VbLf _
		+ "Lesson_Status=" + Session("lesson_status") + VbLf _
		+ "[Core_lesson]" + VbLf _
		+ session("core_lesson")
	response.write(res)
case "killsession"
	Session.Abandon()
	res = "Error=0" + VbLf _
		+ "error_text=Successful" + VbLf _
		+ "version=3.5" + VbLf _
		+ "aicc_data=[Core]" + VbLf _
		+ "Score=" + Session("score") + VbLf _
		+ "Time=" + Session("time") + VbLf _
		+ "Lesson_location=" + session("lesson_location")  + VbLf _
		+ "Lesson_Status=" + Session("lesson_status")
	response.write(res)
case "exitau"
	res = "Error=0" + VbLf _
		+ "error_text=Successful" + VbLf _
		+ "version=3.5"
    response.write(res)
case else
	response.write("command not understood:""" + request.Form("command") + """")
end select

function getKeyVal(key)
	dim i
	dim e
    dim val
	i = instr(1, aicc_data, key, 1)
	if i>0 then
		i = instr(i, aicc_data, "=", 1) 'advance to =
		e = instr(i, aicc_data, del, 1) 'advance to delimiter
		if e=0 then e=len(aicc_data)+1
		val = mid(aicc_data, i+1, e-i-1)
		'response.Write("key " + key + " is >>" & val & "<<" & vbCrLf)		
		getKeyVal = val
	end if
end function

function getCoreLesson()
	dim i
	dim e
    dim str
	dim key: key = "[Core_lesson]"
	i = instr(1, aicc_data, key, 1)
	e = len(aicc_data)
    str = mid(aicc_data, i+len(key)+1, e-i-1)
    str = replace(str, VbCr, "")
    str = replace(str, VbLf, "")
	getCoreLesson = trim(str)
end function
%>