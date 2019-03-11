using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class aicc : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            lms_Entities db = new ClientDBEntities();
            string command = Request.Form["command"];
            string version = Request.Form["version"];
            string[] session = Request.Form["session_id"].ToString().Split('|');
            int userId = int.Parse(session[0]);
            int courseId = int.Parse(session[1]);
            int assignmentId = int.Parse(session[2]);
            const string CRLF = "\r\n";
            string str = "";

            switch (command)
            {
                case "getparam":

                    db.Course_ScormValueSet(userId, assignmentId, courseId, "SET-STARTDATE", null); //this forces a set of "startDate" if necessary
                    Course_StartupDefaults_Result initInfo = db.Course_StartupDefaults(userId, assignmentId, courseId).FirstOrDefault();
                    str = "error=0" + CRLF
                        + "error_text=successful" + CRLF
                        + "version=2.0" + CRLF
                        + "aicc_data=[core]" + CRLF
                        + "Student_ID=" + userId + CRLF
                        + "Student_Name=" + initInfo.student_name + CRLF
                        + "Output_file=" + CRLF
                        + "Credit=c" + CRLF
                        + "Lesson_Location=" + initInfo.lesson_location + CRLF
                        + "Lesson_Status=" + initInfo.lesson_status + CRLF
                        + "path=" + CRLF
                        + "Score=" + initInfo.maxScore + CRLF
                        + "Time=00:00:00"; //+ initInfo.totalTimeUsage
                    break;

                case "putparam":

                    AICCDataReader aiccData = new AICCDataReader(Request.Form["aicc_data"]); //data looks like this: //"[core]\r\nlesson_status=i\r\nlesson_location=m01_s01_t01~m01_s01_t01\r\ntime=00:00:03\r\n"
                    string sessionTime = aiccData.GetKeyValue("time");
                    string lesson_location = aiccData.GetKeyValue("lesson_location");
                    string lesson_status = aiccData.GetKeyValue("lesson_status");
                    string score = aiccData.GetKeyValue("score");

                    db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.LESSON_STATUS", lesson_status);
                    db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.LESSON_LOCATION", lesson_location);
                    if (score.Length>0) db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SCORE.RAW", score);
                    db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.SESSION_TIME", sessionTime);
                      
                    //'build response
                    str = "error=0" + CRLF
                        + "error_text=Successful" + CRLF
                        + "version=2.0";
                    break;

                case "exitau":

                    str = "error=0" + CRLF 
                        + "error_text=Successful" + CRLF 
                        + "version=2.0";
                    break;

                default:

                    Log.Info("AICC command not understood:" + command, true);
                    break;

            }

            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Write(str);
            Response.End();
            Log.Info("LMS returned:" + str);
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
            foreach(string Pair in KeyPair)
            {
                PairData = Pair.Split('=');
                Key = PairData[0];
                if (PairData.Length == 2) {
                    Val = PairData[1];
                }
                else
                {
                    Val = "";
                }
                if (Key.Length > 0) _AICCTable.Add(Key, Val);
            }
        }
        public string GetKeyValue(string key)
        {
            if (_AICCTable.ContainsKey(key))
            {
                return _AICCTable[key].ToString();
            }
            else
            {
                return "";
            }
        }
    }

}