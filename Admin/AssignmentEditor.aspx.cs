using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Admin
{
    public partial class AssignmentEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? assignmentId = Utilities.TryToParseAsInt(Request.QueryString["aId"]);
            if (assignmentId != null)
            {
                lms_Entities db = new ClientDBEntities();
                Assignment assig = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
                tbAssigTitle.Text = assig.title;
                //cbEnabled.Checked = assig.enabled;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveAssignment(string title)
        {
            string aid = Utilities.getQueryString("aId");
            int? assignmentId = Utilities.TryToParseAsInt(aid);

            lms_Entities db = new ClientDBEntities();
            if (assignmentId == null)
            {
                //this is a new Assignment
                db.Assignments.Add(new Assignment
                {
                    title = title,
                    type = (int)AssignmentType.LEARNING_PLAN,
                    //enabled = enabled,
                    timestamp = DateTime.Now
                });
            }
            else
            {
                //this is an update
                Assignment asg = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
                asg.title = title;
                
                //asg.enabled = enabled;
            }
            db.SaveChanges();
            return JsonResponse.NoError;
        }

    }
}