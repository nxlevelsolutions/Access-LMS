using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    /// <summary>
    /// Summary description for aicc1
    /// </summary>
    public class aicc : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {

            lms_Entities db = new ClientDBEntities();
            string command = context.Request.Form["command"]?.ToUpper();
            string version = context.Request.Form["version"];
            string[] session = context.Request.Form["session_id"].ToString().Split('|');
            int userId = int.Parse(session[0]);
            int courseId = int.Parse(session[1]);
            int assignmentId = int.Parse(session[2]);
            const string CRLF = "\r\n";
            string str = "";

            switch (command)
            {
                case "GETPARAM":

                    db.Course_ScormValueSet(userId, assignmentId, courseId, "SET-STARTDATE", null); //this forces a set of "startDate" if necessary
                    Course_StartupDefaults_Result initInfo = db.Course_StartupDefaults(userId, assignmentId, courseId).FirstOrDefault();
                    str = "error=0" + CRLF
                        + "error_text=successful" + CRLF
                        + "version=" + version + CRLF
                        + "aicc_data=[core]" + CRLF
                        + "Student_ID=" + userId + CRLF
                        + "Student_Name=" + initInfo.student_name + CRLF
                        + "Output_file=" + CRLF
                        + "Credit=c" + CRLF
                        + "Lesson_Location=" + initInfo.lesson_location + CRLF
                        + "Lesson_Status=" + initInfo.lesson_status + CRLF
                        + "path=" + CRLF
                        + "Score=" + initInfo.maxScore + CRLF
                        + "Time=00:00:00" + CRLF
                        + "[Core_Lesson]" + CRLF
                        + initInfo.suspend_data; //+ initInfo.totalTimeUsage
                    Log.Info("Aicc GETPARAM return:" + str);

                    break;

                case "PUTPARAM":

                    AICCDataReader aiccData = new AICCDataReader(context.Request.Form["aicc_data"]); //data looks like this: //"[core]\r\nlesson_status=i\r\nlesson_location=m01_s01_t01~m01_s01_t01\r\ntime=00:00:03\r\n"
                    string lesson_location = aiccData.GetKeyValue("lesson_location");
                    string lesson_status = aiccData.GetKeyValue("lesson_status");
                    string score = aiccData.GetKeyValue("score");
                    string suspend_data = aiccData.GetKeyValue("[core_lesson]");

                    //take only the first 99 hours of session time.. or SQL db will cry
                    string sessionTime = aiccData.GetKeyValue("time");
                    string[] tmp = sessionTime.Split(':');
                    if (tmp[0].Length == 4)
                    {
                        tmp[0] = tmp[0].Substring(2);
                        sessionTime = string.Join(":", tmp);
                    }

                    db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.LESSON_STATUS", lesson_status);
                    db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.LESSON_LOCATION", lesson_location);
                    if (score.Length > 0) db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SCORE.RAW", score);
                    db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SESSION_TIME", sessionTime);
                    db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.SUSPEND_DATA", suspend_data);

                    //'build response
                    str = "error=0" + CRLF
                        + "error_text=Successful" + CRLF
                        + "version=" + version;
                    break;

                case "PUTINTERACTIONS":

                    //IGNORED... send "sure, ok" messsage
                    str = "error=0" + CRLF
                        + "error_text=Successful" + CRLF
                        + "version=" + version;
                    break;

                case "EXITAU":

                    //IGNORED... send "sure, ok" messsage
                    str = "error=0" + CRLF
                        + "error_text=Successful" + CRLF
                        + "version=" + version;
                    break;

                default:

                    Log.Error("AICC command not implemented:" + command, false);
                    break;

            }

            context.Response.ContentType = "text/plain";
            context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            context.Response.Write(str);
            context.Response.End();
            
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    class AICCDataReader
    {
        private const string CRLF = "\r\n";
        private Hashtable _AICCTable = new Hashtable();

        public AICCDataReader(string aicc_data)
        {
            string[] PairData;
            string Key;
            string Val;
            string[] KeyPair = aicc_data.Split(CRLF.ToCharArray());
            for (int i=0; i< KeyPair.Length; i++) 
            {
                Val = "";
                string Pair = KeyPair[i];
                PairData = Pair.Split('=');
                Key = PairData[0].ToLower();
                if (PairData.Length == 2)
                {
                    Val = PairData[1];
                }
                else
                {
                    if (Key == "[core_lesson]")
                    {
                        if ((i+2) <= KeyPair.Length)
                        {
                            Val = KeyPair[i + 2];
                            i += 2;
                        }
                    }
                }
                if (Key.Length > 0) _AICCTable.Add(Key, Val);
            }
        }
        public string GetKeyValue(string key)
        {
            if (_AICCTable.ContainsKey(key))
            {
                return _AICCTable[key.ToLower()].ToString();
            }
            else
            {
                return "";
            }
        }
    }
}