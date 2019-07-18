using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Reports
{
    public partial class UserCourse : System.Web.UI.Page
    {

        public bool courseHasStarted = false;

        protected void Page_Load(object sender, EventArgs e)
        {
            //get data
            lms_Entities db = new ClientDBEntities();
            List<User_UsageHistory_Result> history = db.User_UsageHistory(
                Utilities.TryToParseAsInt(Request.QueryString["uid"]),
                Utilities.TryToParseAsInt(Request.QueryString["aid"]),
                Utilities.TryToParseAsInt(Request.QueryString["cid"])).ToList();

            //translate labels
            foreach (User_UsageHistory_Result item in history)
            {
                switch ((UsageEventType)item.eventType)
                {
                    case UsageEventType.SCORE: 
                        item.eventData = Resources.Global.LabelScore + "=" + item.eventData;
                        break;
                    case UsageEventType.STARTED: 
                        item.eventData = Resources.Global.LabelStarted;
                        courseHasStarted = true;
                        break;
                    case UsageEventType.COMPLETED: 
                        item.eventData = Resources.Global.LabelCompleted;
                        break;
                }
            }

            //render
            rptAttempts.DataSource = history;
            rptAttempts.DataBind();

        }

        protected void lnkDownload_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("user-course", rptAttempts);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string DeleteEvent(int rowId, UsageEventType eventType)
        {
            try
            {
                lms_Entities db = new ClientDBEntities();
                if (eventType == UsageEventType.SCORE)
                {
                    Courses_Scores cs = db.Courses_Scores.Where(c => c.rowId == rowId).FirstOrDefault();
                    db.Courses_Scores.Remove(cs);
                }
                else
                {
                    Courses_Usage cu = db.Courses_Usage.Where(c => c.rowId == rowId).FirstOrDefault();
                    db.Courses_Usage.Remove(cu);
                }
                db.SaveChanges();

                return JsonResponse.NoError;
            }
            catch (Exception ex)
            {
                return JsonResponse.Error(ex);
            }
        }

    }
}