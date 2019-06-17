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
                                @"""startDate"":" + (res.startDate == null ? "null" : @"""" + String.Format("{0:d}", res.startDate) + @"""") + "," +
                                @"""completedDate"":" + (res.completedDate == null ? "null" : "\"" + String.Format("{0:d}", res.completedDate) + @"""") + "," +
                                @"""maxScore"":" + (res.maxScore == null ? "null" : res.maxScore.ToString()) +
                            "}"
                        );
                    }
                    break;

                case "SCORM_COURSE_INITIAL_DEFAULTS":
                    //load all initial scorm values and send to scorm.js manager
                    Log.Info("User " + userId + " launched course:" + courseId + ", assignmentId:" + assignmentId);
                    db.Course_ScormValueSet(userId, assignmentId, courseId, "SET-STARTDATE", null); //this forces a set of "startDate" if necessary
                    Course_StartupDefaults_Result initInfo = db.Course_StartupDefaults(userId, assignmentId, courseId).FirstOrDefault();

                    string suspend_data = initInfo.suspend_data?.Replace("\"", "\\\""); //encode double quotes
                    string total_time = initInfo.totalTimeUsage == null ? "0000:00:00.00" : String.Format("00{0:%hh}:{0:%mm}:{0:%s}", initInfo.totalTimeUsage);

                    context.Response.ContentType = "application/json; charset=utf-8";
                    context.Response.Write(
                        @"{""cmi"":{" +
                            @"""launch_data"":""""," +
                            @"""interactions"": {""_count"": 0}," +
                            @"""student_data"": {""mastery_score"": """"}," +
                            @"""core"":{" +
                                @"""total_time"":"""+ total_time + @"""," +
                                @"""student_id"":" + userId + "," +
                                @"""lesson_mode"":""normal""," +
                                @"""lesson_status"":""" + initInfo.lesson_status + @"""," +
                                @"""lesson_location"":""" + initInfo.lesson_location + @"""," +
                                @"""student_name"":""" + initInfo.student_name + @"""," +
                                @"""score"": {" +
                                    @"""raw"":" + (initInfo.maxScore == null ? @"""""" : initInfo.maxScore.ToString()) + "}" +
                                @"}," +
                            @"""suspend_data"":""" + suspend_data + @"""" +
                            "}" +
                        "}"
                    );
                    break;

                case "KEEP_SESSION_ALIVE":
                    context.Response.ContentType = "text/plain";
                    context.Response.Write("<html>");
                    context.Response.Write("<head>");
                    context.Response.Write("<meta http-equiv=\"refresh\" content=\"" + context.Request.QueryString["secs"] + "\">"); //every 5 minutes (300 seconds)
                    context.Response.Write("<meta http-equiv=\"pragma\"  content=\"no-cache\">");
                    context.Response.Write("<meta http-equiv=\"expires\" content=\"0\">");
                    context.Response.Write("</head>");
                    context.Response.Write("<body></body>");
                    context.Response.Write("</html>");
                    break;

                case "CMI.INTERACTIONS.0.STUDENT_RESPONSE":
                    //THIS MESSAGE IGNORED IN THIS PARTICULAR LMS INSTANCE
                    context.Response.ContentType = "application/json; charset=utf-8";
                    context.Response.Write("{\"result\":true}");
                    break;

                case "CMI.CORE.LESSON_STATUS":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    Log.Info("User " + userId + " status set to:\"" + context.Request.Form["data"] + "\", course:" + courseId + ", assignmentId:" + assignmentId);
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
                        string session_time = context.Request.Form["data"];
                        //NOTE: session time comes in a format like "0000:00:02.75"... 4 digits for hour
                        if (session_time.Length == 0)
                        {
                            session_time = null;
                        }
                        else
                        {
                            //take only the first 99 hours
                            string[] tmp = session_time.Split(':');
                            if (tmp[0].Length == 4)
                            {
                                tmp[0] = tmp[0].Substring(2);
                                session_time = string.Join(":", tmp);
                            }
                         }
                        int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SESSION_TIME", session_time).FirstOrDefault();
                        context.Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                    }
                    else
                    {
                        context.Response.Write("{\"result\":false}");
                    }
                    break;

                case "CMI.CORE.SCORE.RAW":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    Log.Info("Score received:\"" + context.Request.Form["data"] + "\" for course id:" + courseId + ", userId:" + userId + ", assignmentId:" + assignmentId);
                    if (context.Request.QueryString["dir"] == "set")
                    {
                        double? score = Utilities.TryToParseAsDouble(context.Request.Form["data"]);
                        if (score == null)
                        {
                            Log.Info("Score ignored.");
                            context.Response.Write("{\"result\":true}"); //just to keep the course happy
                        }
                        else
                        {
                            int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SCORE.RAW", context.Request.Form["data"]).FirstOrDefault();
                            Log.Info("Score saved:\"" + context.Request.Form["data"] + "\" for course id:" + courseId + ", userId:" + userId + ", assignmentId:" + assignmentId + ", records changed=" + affected);
                            context.Response.Write(@"{""result"":" + (affected == 1 ? "true" : "false") + "}");
                        }
                    }
                    else
                    {
                        context.Response.Write("{\"result\":false}");
                    }
                    break;

                case "CMI.CORE.EXIT":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    context.Response.Write("{\"result\": true}");
                    break;

                case "COURSE_LAUNCH_PARAMS":
                    context.Response.ContentType = "application/json; charset=utf-8";
                    Course crs = db.Courses.Where(c => c.courseId == courseId).FirstOrDefault();
                    context.Response.Write(
                        "{" +
                            "\"title\":\"" + crs.title + "\"," +
                            "\"url\":\"" + crs.url + "\"," +
                            "\"type\":" + crs.type + "," +
                            "\"width\":" + (crs.browserWidth==null? "null": crs.browserWidth.ToString()) + "," +
                            "\"height\":" + (crs.browserHeight == null ? "null" : crs.browserHeight.ToString()) + 
                        "}"
                    );
                    break;

                default:
                    context.Response.ContentType = "application/json; charset=utf-8";
                    Log.Info("User:" + userId + " unknown message \"" + context.Request.QueryString["m"] + "\", course:" + courseId + ", assignmentId:" + assignmentId);
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