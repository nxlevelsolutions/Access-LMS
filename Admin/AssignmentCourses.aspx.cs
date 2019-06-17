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
    public partial class AssignmentCourses : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? assignmentId = Utilities.TryToParseAsInt(Request.QueryString["aid"]);
            lms_Entities db = new ClientDBEntities();

            //get CoursesInOrder option
            Assignment asg = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
            cbAvailableInOrder.Checked = asg.availCoursesInOrder;

            //get and sort courses
            List<Assignment_CoursesGet_Result> allCourses = db.Assignment_CoursesGet(assignmentId).ToList();
            if (asg.availCoursesInOrder)
            {
                allCourses = allCourses.OrderBy(c => c.orderId).ToList();
            }
            else
            {
                allCourses = allCourses.OrderBy(c => c.title).ToList();
            }

            //bind list
            rptCourses.DataSource = allCourses;
            rptCourses.DataBind();

            //show no courses available message
            litNoResult.Visible = rptCourses.Items.Count == 0;

        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveCourses(string courseIds, bool availInOrder)
        {
            string aid = Utilities.GetQueryString("aid");
            int? assignmentId = Utilities.TryToParseAsInt(aid);

            lms_Entities db = new ClientDBEntities();
            db.Assignment_CoursesSet(assignmentId, courseIds);

            //set CoursesInOrder option
            Assignment asg = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
            asg.availCoursesInOrder = availInOrder;
            db.SaveChanges();

            return JsonResponse.NoError; 
        }
    }
}