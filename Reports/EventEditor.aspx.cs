using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Reports
{
    public partial class EventEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? eventType = Utilities.TryToParseAsInt(Request.QueryString["et"]); //event type key
            int? rowId = Utilities.TryToParseAsInt(Request.QueryString["rowId"]);  //row ID key
            bool? courseStarted = Utilities.TryToParseAsBool(Request.QueryString["st"]); //course started key

            if (eventType != null && rowId != null)
            {
                //load event data
                lms_Entities db = new ClientDBEntities();
                RBDateType.Enabled = RBScoreType.Enabled = false;
                if (eventType == (int)UsageEventType.SCORE)
                {
                    //it's a SCORE
                    RBScoreType.Checked = true;
                    RBDateType.Checked = false;
                    Courses_Scores cs = db.Courses_Scores.Where(c => c.rowId == rowId).FirstOrDefault();
                    TxtScore.Text = cs.score.ToString();
                    TxtTimestamp.Text = cs.dateStamp.ToString();
                }
                else
                {
                    //it's a STARTED/COMPLETED event
                    RBScoreType.Checked = false;
                    RBDateType.Checked = true;
                    Courses_Usage cu = db.Courses_Usage.Where(c => c.rowId == rowId).FirstOrDefault();
                    TxtStartedDate.Text = cu.startDate.ToString();
                    TxtCompletedDate.Text = cu.endDate.ToString();
                }

            }
            else
            {
                // new event: enable some things, not all
                if (courseStarted == true)
                {
                    RBDateType.Enabled = false;
                    RBDateType.Checked = false;
                    RBScoreType.Checked = true;
                }
                else
                {
                    RBScoreType.Enabled = false;
                    RBScoreType.Checked = false;
                    RBDateType.Checked = true;
                }
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string Save(bool isScoreType, decimal? score, string scoreDate, string startDate, string endDate)
        {
            string rowIdStr = Utilities.GetQueryString("rowId");
            int? rowId = Utilities.TryToParseAsInt(rowIdStr);

            try
            {
                Courses_Scores cs;
                Courses_Usage cu;
                lms_Entities db = new ClientDBEntities();
                if (rowId == null)
                {
                    //this is a new event
                    if (isScoreType)
                    {
                        DateTime? dateStamp;
                        if (scoreDate == "")
                        {
                            dateStamp = DateTime.Now;
                        }
                        else
                        {
                            dateStamp = Utilities.TryToParseAsDateTime(scoreDate);
                            if (dateStamp == null)
                            {
                                return JsonResponse.Error("Incorrect date/time format entered. Please try again.");
                            }
                            else
                            {
                                cs = new Courses_Scores();
                                cs.score = Utilities.TryToParseAsDec(score.ToString()); //clean just in case
                                cs.dateStamp = (DateTime) dateStamp;
                                db.Courses_Scores.Add(cs);
                            }
                        }
                    }
                    else
                    {
                        DateTime? startDateTime = Utilities.TryToParseAsDateTime(startDate);
                        if (startDateTime == null)
                        {
                            return JsonResponse.Error("Incorrect STARTED date/time format entered. Please try again.");
                        }
                        else
                        {
                            DateTime? endDateTime;
                            if (endDate == "")
                            {
                                endDateTime = null;
                            }
                            else
                            {
                                endDateTime = Utilities.TryToParseAsDateTime(endDate);
                                if (endDateTime == null)
                                {
                                    return JsonResponse.Error("Incorrect COMPLETED date/time format entered. Please try again.");
                                }
                            }
                            cu = new Courses_Usage();
                            cu.assignmentId = (int) Utilities.TryToParseAsInt(Utilities.GetQueryString("aId"));
                            cu.courseId = (int)Utilities.TryToParseAsInt(Utilities.GetQueryString("cId"));
                            cu.userId = (int)Utilities.TryToParseAsInt(Utilities.GetQueryString("uId"));
                            cu.startDate = (DateTime) startDateTime;
                            cu.endDate = endDateTime;
                            db.Courses_Usage.Add(cu);
                        }
                    }
                }
                else
                {
                    //this is an update
                    if (isScoreType)
                    {
                        DateTime? dateStamp;
                        if (scoreDate == "")
                        {
                            dateStamp = DateTime.Now;
                        }
                        else
                        {
                            dateStamp = Utilities.TryToParseAsDateTime(scoreDate);
                            if (dateStamp == null)
                            {
                                return JsonResponse.Error("Incorrect date/time format entered. Please try again.");
                            }
                            else
                            {
                                cs = db.Courses_Scores.Where(c => c.rowId == rowId).FirstOrDefault();
                                cs.score = Utilities.TryToParseAsDec(score.ToString());
                                cs.dateStamp = (DateTime) dateStamp;
                            }
                        }
                    }
                    else
                    {
                        DateTime? startDateTime = Utilities.TryToParseAsDateTime(startDate);
                        if (startDateTime == null)
                        {
                            return JsonResponse.Error("Incorrect STARTED date/time format entered. Please try again.");
                        }
                        else
                        {
                            DateTime? endDateTime;
                            if (endDate == "")
                            {
                                endDateTime = null;
                            }
                            else
                            {
                                endDateTime = Utilities.TryToParseAsDateTime(endDate);
                                if (endDateTime == null)
                                {
                                    return JsonResponse.Error("Incorrect COMPLETED date/time format entered. Please try again.");
                                }
                            }
                            cu = db.Courses_Usage.Where(c => c.rowId == rowId).FirstOrDefault();
                            cu.assignmentId = (int)Utilities.TryToParseAsInt(Utilities.GetQueryString("aId"));
                            cu.courseId = (int)Utilities.TryToParseAsInt(Utilities.GetQueryString("cId"));
                            cu.userId = (int)Utilities.TryToParseAsInt(Utilities.GetQueryString("uId"));
                            cu.startDate = (DateTime)startDateTime;
                            cu.endDate = endDateTime;
                        }
                    }
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