using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;
 

namespace NXLevel.LMS.Admin
{
    public partial class lms_message : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            int courseId = 0;
            int userId;

            //set UserID coming from course primarily
            if (Request.QueryString["uid"] == null) {
                userId = LmsUser.UserId;
            }
            else {
                userId = int.Parse(Request.QueryString["uid"]);
            }
           
            if (Request.QueryString["cid"]!=null)
                courseId = int.Parse(Request.QueryString["cid"]);


            //call functions
            switch (Request.QueryString["m"].ToUpper())
            {
                case "GET_COURSE_STATS":
                    //-----------------------------------------------
                    // displays data in curriculum page - per course
                    //-----------------------------------------------
                    if (userId == 0)
                    {
                        Log.Error("User:UNKNOWN SESSION called GET_COURSE_STATS function");
                        Response.Write("NO_SESSION");
                    }
                    else
                    {
                        Course_BasicInfo_Result res = db.Course_BasicInfo(courseId, userId).FirstOrDefault();
                        Response.ContentType = "application/json; charset=utf-8";
                        Response.Write(
                            "{" +
                                @"""startDate"":" + (res.startDate == null ? "null" : @"""" + res.startDate.ToString() + @"""") +
                                @",""completedDate"":" + (res.completedDate == null ? "null" : "\"" + res.completedDate.ToString() + @"""") +
                                @",""maxScore"":" + (res.maxScore == null ? "null" : res.maxScore.ToString()) + 
                            "}"
                        );
                    }
                    break;

                case "SCORM_COURSE_INITIAL_DEFAULTS":
                    //load all initial scorm values and send to scorm.js manager
                    Log.Info("User " + userId + " launched course:" + courseId);
                    Course_StartupDefaults_Result initInfo = db.Course_StartupDefaults(userId, courseId).FirstOrDefault();

                    // DEFAULT SCORM OBJECT LOADED ON START":
                    //{cmi:{
                    //      core:{
                    //           lesson_mode:'normal',
                    //           lesson_status:'',
                    //           lesson_location:'',
                    //           student_name: '',
                    //           score:{
                    //                  raw:0,
                    //                 }
                    //           },
                    //      suspend_data:''
                    //     }
                    //}
                    Response.ContentType = "application/json; charset=utf-8";
                    Response.Write(
                        @"{""cmi"":{" +
                            @"""core"":{" +
                                @"""lesson_mode"":""normal""," +
                                @"""lesson_status"":""" + initInfo.lesson_status + @"""," +
                                @"""lesson_location"":""" + initInfo.lesson_location + @"""," +
                                @"""student_name"":""" + initInfo.student_name + @"""," +
                                @"""score"":{" +
                                    @"""raw"":" + (initInfo.maxScore==null?"null": initInfo.maxScore.ToString()) +
                                    @"}" +
                                @"}," +
                            @"""suspend_data"":""" + initInfo.suspend_data + @"""" +
                            "}" +
                        "}"
                    );
                    break;

                case "SAVE_SCORE":
                    //if userId = 0 
                    //    Log.Write("User:UNKNOWN SESSION score=" + Request.QueryString["score") + ", courseId=" & courseId)
                    //    Response.Write("NO_SESSION")
                    //else{
                    //    Log.Write("score:" + Request.QueryString["score") + " course id:" & courseId & " userId:" & userId)
                    //    sql = "INSERT INTO tblModules_Scores (id_modid,id_user,int_score) VALUES (" _
                    //        & courseId & "," _
                    //        & userId & "," _
                    //        + Request.QueryString["score") + ")"
                    //    ExecuteQuery(sql)
                    //    Response.Write("0")
                    //}
                    break;

                case "GET_BOOKMARK":
                    //Dim dbConn As New SqlConnection(Application("ConnectionString"))
                    //Dim com As SqlCommand = dbConn.CreateCommand()
                    //Dim dr As SqlDataReader

                    //if userId = 0 
                    //    Log.Write("User:UNKNOWN SESSION: courseId=" & courseId)
                    //    Response.Write("NO_SESSION")
                    //else{
                    //    //get datareader from db - assigned courses
                    //    sql = "SELECT str_suspend_data FROM tblModules_Usage " _
                    //        + "WHERE id_User = " & userId & " " _
                    //        + "AND id_modid=" & courseId
                    //    com.CommandText = sql
                    //    dbConn.Open()
                    //    dr = com.ExecuteReader()
                    //    if dr.Read() 
                    //        Response.Write("data=" + dr(0))
                    //    else{
                    //        Response.Write("data=")
                    //    }
                    //    dr.Close()
                    //    dbConn.Close()
                    //}
                    break;

                case "SET_BOOKMARK":
                    //Dim data As String
                    //if Not Request.Form("data") Is Nothing AndAlso Request.Form("data").Length > 0 
                    //    data = Request.Form("data").ToString
                    //else{
                    //    data = Request.QueryString["data").ToString
                    //}

                    //sql = "UPDATE tblModules_Usage " _
                    //    + "SET str_suspend_data=//" + data + "// " _
                    //    + "WHERE id_User=" & userId & " " _
                    //    + "AND id_modid=" & courseId
                    //ExecuteQuery(sql)
                    //Response.Write("0")
                    break;

                case "GET_NUM_ATTEMPTS":
                    //    Dim dbConn As New SqlConnection(Application("ConnectionString"))
                    //Dim com As SqlCommand = dbConn.CreateCommand()
                    //Dim dr As SqlDataReader

                    ////get datareader from db - assigned courses
                    //sql = "SELECT COUNT(int_score) FROM tblModules_Scores " _
                    //    + "WHERE id_User = " & userId & " " _
                    //    + "AND id_modid=" & courseId
                    //com.CommandText = sql
                    //dbConn.Open()
                    //dr = com.ExecuteReader()
                    //if dr.Read() 
                    //    Response.Write("attempts=" & dr(0))
                    //else{
                    //    Response.Write("attempts=0")
                    //}
                    //dr.Close()
                    //dbConn.Close()
                    break;

                case "SET_COURSE_COMPLETE":
                    //    if userId = 0 
                    //    Log.Write("User:UNKNOWN SESSION called SET_COURSE_COMPLETE function")
                    //    Response.Write("-1")
                    //else{
                    //    Log.Write("User " & userId & " completed course ID:" & courseId)
                    //    sql = "UPDATE tblModules_Usage " _
                    //        + "SET dt_endDate=//" + Date.Now.ToString() + "// " _
                    //        + "WHERE id_User=" & userId & " " _
                    //        + "AND id_modid=" & courseId
                    //    ExecuteQuery(sql)
                    //    Response.Write("0")
                    //}
                    break;

                case "KEEP_SESSION_ALIVE":
                    Response.Write("<html>");
                    Response.Write("<head>");
                    Response.Write("<meta http-equiv=\"refresh\" content=\"" + Request.QueryString["secs"] + "\">"); //every 5 minutes (300 seconds)
                    Response.Write("<meta http-equiv=\"pragma\" content=\"no-cache\">");
                    Response.Write("<meta http-equiv=\"expires\" content=\"0\">");
                    Response.Write("</head>");
                    Response.Write("<body></body>");
                    Response.Write("</html>");
                    Response.End();
                    break;
 
                case "CMI.INTERACTIONS.0.STUDENT_RESPONSE":
                    //THIS MESSAGE IGNORED IN THIS PARTICULAR LMS INSTANCE
                    break;

                case "CMI.CORE.LESSON_STATUS":
                    Response.ContentType = "application/json; charset=utf-8";
                    if (Request.QueryString["dir"] == "set")
                    {
                        //allowed values:passed, completed, failed, incomplete, browsed, not attempted
                        int? affected = db.Course_ScormValueSet(userId, courseId, "CMI.CORE.LESSON_STATUS", Request.Form["data"]).FirstOrDefault();
                        Response.Write(@"{""result"":" + (affected==1 ? "true": "false") +  "}");
                    }
                    else
                    {
                        Response.Write("{\"result\":false}");
                    }
                    Response.End();
                    break;

                case "CMI.CORE.LESSON_LOCATION":
                    Response.ContentType = "application/json; charset=utf-8";
                    if (Request.QueryString["dir"] == "set")
                    {
                        int? affected = db.Course_ScormValueSet(userId, courseId, "CMI.CORE.LESSON_LOCATION", Request.Form["data"]).FirstOrDefault();
                        Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        Response.Write("{\"result\":false}");
                    }
                    Response.End();
                    break;

                case "CMI.SUSPEND_DATA":
                    Response.ContentType = "application/json; charset=utf-8";
                    if (Request.QueryString["dir"] == "set")
                    {
                        int? affected = db.Course_ScormValueSet(userId, courseId, "CMI.SUSPEND_DATA", Request.Form["data"]).FirstOrDefault();
                        Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        Response.Write("{\"result\":false}");
                    }
                    Response.End();
                    break;

                case "CMI.CORE.SESSION_TIME":
                    Response.ContentType = "application/json; charset=utf-8";
                    if (Request.QueryString["dir"] == "set")
                    {
                        int? affected = db.Course_ScormValueSet(userId, courseId, "CMI.CORE.SESSION_TIME", Request.Form["data"]).FirstOrDefault();
                        Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        Response.Write("{\"result\":false}");
                    }
                    Response.End();
                    break;

                case "CMI.CORE.SCORE.RAW":
                    Response.ContentType = "application/json; charset=utf-8";
                    if (Request.QueryString["dir"] == "set")
                    {
                        Log.Info("score:" + Request.Form["data"] + " course id:" + courseId + " userId:" + userId);
                        int? affected = db.Course_ScormValueSet(userId, courseId, "CMI.CORE.SCORE.RAW", Request.Form["data"]).FirstOrDefault();
                        Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        Response.Write("{\"result\":false}");
                    }
                    Response.End();
                    break;

                default:
                    //Response.Write("Message not implemented:" + Request.QueryString["m"))
                    Log.Info("User:" + userId + " unknown message \"" + Request.QueryString["m"] + "\".");
                    break;

             }
        }
         

    }
}