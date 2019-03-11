using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Admin
{
    /// <summary>
    /// Summary description for LmsMessage
    /// </summary>
    public class LmsMessage : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {

            lms_Entities db = new ClientDBEntities();
            int? assignmentId = null;
            int? courseId =null;
            int userId;

            //set UserID coming from course primarily
            if (context.Request.QueryString["uid"] == null)
            {
                userId = LmsUser.UserId;
            }
            else
            {
                userId = int.Parse(context.Request.QueryString["uid"]);
            }

            if (context.Request.QueryString["aid"] != null)
                assignmentId = int.Parse(context.Request.QueryString["aid"]);
            if (context.Request.QueryString["cid"] != null)
                courseId = int.Parse(context.Request.QueryString["cid"]);


            //call functions
            switch (context.Request.QueryString["m"].ToUpper())
            {
                case "GET_COURSE_STATS":
                    //-----------------------------------------------
                    // displays data in curriculum page - per course
                    //-----------------------------------------------
                    if (userId == 0)
                    {
                        Log.Error("User:UNKNOWN SESSION called GET_COURSE_STATS function");
                        context.Response.Write("NO_SESSION");
                    }
                    else
                    {
                        Course_BasicInfo_Result res = db.Course_BasicInfo(assignmentId, courseId, userId).FirstOrDefault();
                        context.Response.ContentType = "application/json; charset=utf-8";
                        context.Response.Write(
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
                    db.Course_ScormValueSet(userId, assignmentId, courseId, "SET-STARTDATE", null); //this forces a set of "startDate" if necessary
                    Course_StartupDefaults_Result initInfo = db.Course_StartupDefaults(userId, assignmentId, courseId).FirstOrDefault();

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
                    context.Response.ContentType = "application/json; charset=utf-8";
                    context.Response.Write(
                        @"{""cmi"":{" +
                            @"""core"":{" +
                                @"""lesson_mode"":""normal""," +
                                @"""lesson_status"":""" + initInfo.lesson_status + @"""," +
                                @"""lesson_location"":""" + initInfo.lesson_location + @"""," +
                                @"""student_name"":""" + initInfo.student_name + @"""," +
                                @"""score"":{" +
                                    @"""raw"":" + (initInfo.maxScore == null ? "null" : initInfo.maxScore.ToString()) +
                                    @"}" +
                                @"}," +
                            @"""suspend_data"":""" + initInfo.suspend_data + @"""" +
                            "}" +
                        "}"
                    );
                    break;

                case "KEEP_SESSION_ALIVE":
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("<html>");
                    context.Response.Write("<head>");
                    context.Response.Write("<meta http-equiv=\"refresh\" content=\"" + context.Request.QueryString["secs"] + "\">"); //every 5 minutes (300 seconds)
                    context.Response.Write("<meta http-equiv=\"pragma\" content=\"no-cache\">");
                    context.Response.Write("<meta http-equiv=\"expires\" content=\"0\">");
                    context.Response.Write("</head>");
                    context.Response.Write("<body></body>");
                    context.Response.Write("</html>");
                    break;

                case "CMI.INTERACTIONS.0.STUDENT_RESPONSE":
                    //THIS MESSAGE IGNORED IN THIS PARTICULAR LMS INSTANCE
                    break;

                case "CMI.CORE.LESSON_STATUS":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    if (context.Request.QueryString["dir"] == "set")
                    {
                        //allowed values:passed, completed, failed, incomplete, browsed, not attempted
                        int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.LESSON_STATUS", context.Request.Form["data"]).FirstOrDefault();
                        context.Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        context.Response.Write("{\"result\":false}");
                    }
                    break;

                case "CMI.CORE.LESSON_LOCATION":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    if (context.Request.QueryString["dir"] == "set")
                    {
                        int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.LESSON_LOCATION", context.Request.Form["data"]).FirstOrDefault();
                        context.Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        context.Response.Write("{\"result\":false}");
                    }
                    break;

                case "CMI.SUSPEND_DATA":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    if (context.Request.QueryString["dir"] == "set")
                    {
                        int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.SUSPEND_DATA", context.Request.Form["data"]).FirstOrDefault();
                        context.Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        context.Response.Write("{\"result\":false}");
                    }
                    break;

                case "CMI.CORE.SESSION_TIME":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    if (context.Request.QueryString["dir"] == "set")
                    {
                        int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SESSION_TIME", context.Request.Form["data"]).FirstOrDefault();
                        context.Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        context.Response.Write("{\"result\":false}");
                    }
                    break;

                case "CMI.CORE.SCORE.RAW":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    if (context.Request.QueryString["dir"] == "set")
                    {
                        Log.Info("score:" + context.Request.Form["data"] + " course id:" + courseId + " userId:" + userId);
                        int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SCORE.RAW", context.Request.Form["data"]).FirstOrDefault();
                        context.Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        context.Response.Write("{\"result\":false}");
                    }
                    break;

                case "COURSE_LAUNCH_PARAMS":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    Course crs = db.Courses.Where(c => c.courseId == courseId).FirstOrDefault();
                    context.Response.Write(
                        "{" +
                            "\"title\":\"" + crs.title + "\"," +
                            "\"url\":\"" + crs.url + "\"," +
                            "\"isScorm\":" + (crs.scorm ? "true" : "false") + "," +
                            "\"isAICC\":" + (crs.aicc ? "true" : "false") + "," +
                            "\"toolbar\":" + (crs.browserToolbar ? "true" : "false") + "," +
                            "\"status\":" + (crs.browserStatus ? "true" : "false") + "," +
                            "\"width\":" + crs.browserWidth + "," +
                            "\"height\":" + crs.browserHeight + 
                        "}"
                    );
                    break;

                default:
                    context.Response.ContentType = "application/json; charset=utf-8";
                    //context.Response.Write("Message not implemented:" + context.Request.QueryString["m"))
                    Log.Info("User:" + userId + " unknown message \"" + context.Request.QueryString["m"] + "\".");
                    context.Response.Write("{\"result\":false}");
                    break;

            }



             
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}