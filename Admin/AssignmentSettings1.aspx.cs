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
    public partial class AssignmentSettings1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();

            //load list of courses
            ddlCourses.DataSource = db.Courses.OrderBy(c => c.title).ToList();
            ddlCourses.DataValueField = "courseId";
            ddlCourses.DataTextField = "title";
            ddlCourses.DataBind();

            //load assignment settings
            int? assignmentId = Utilities.TryToParseAsInt(Request.QueryString["aId"]);
            if (assignmentId != null)
            {
                Assignment asg = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
                cbEnabled.Checked = asg.enabled;
                txtTitle.Text = asg.title;
                txtDescription.Text = asg.description;
                txtDueDate.Text = asg.dueDate?.ToShortDateString();
                txtDueDays.Text = asg.dueDaysAfterAssigned.ToString();
                cbEmailOnAssigned.Checked = asg.sendEmailOnAssigned;
                cbEmailPeriodic.Checked = asg.sendEmailPeriodic;
                txtPeriodicDays.Text = asg.periodicDays.ToString();
                cbEmailNearDueDate.Checked = asg.sendEmailNearDueDate;
                txtNearDueDateDays.Text = asg.nearDueDateDays.ToString();
                cbEmailDueDate.Checked = asg.sendEmailOnDueDate;
                cbEmailOverdue.Checked = asg.sendEmailOverdue;
                txtOverdueDays.Text = asg.overdueDays.ToString();

                //get selected course..there will always be 1 or 0
                List<Assignment_CoursesGet_Result> asgCourses = db.Assignment_CoursesGet(assignmentId).Where(c => c.IsInAssignment==true).ToList();
                if (asgCourses.Count > 0)
                {
                    ddlCourses.SelectedValue = asgCourses[0].courseId.ToString();
                }

            }

        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string Save(
            string title,
            string description,
            string courseId,
            bool enabled,
            DateTime? dueDate,
            int? dueDays,
            bool emailOnAssigned,
            bool emailPeriodic,
            int? periodicDays,
            bool emailNearDueDate,
            int? nearDueDateDays,
            bool emailOnDueDate,
            bool emailOverdue,
            int? overdueDays)
        {

            try
            {
                lms_Entities db = new ClientDBEntities();
                Assignment asg;

                string aid = Utilities.GetQueryString("aId");
                int? assignmentId = Utilities.TryToParseAsInt(aid);
                if (assignmentId == null)
                {
                    //this is a new assignment
                    asg = new Assignment();
                    asg.type = (int)AssignmentType.SINGLE_COURSE;
                    asg.enabled = enabled;
                    asg.title = title;
                    asg.description = description;
                    asg.dueDate = dueDate;
                    asg.dueDaysAfterAssigned = dueDays;
                    if (dueDate != null && dueDays != null) asg.dueDaysAfterAssigned = null; //default to dueDate if both provided
                    asg.sendEmailOnAssigned = emailOnAssigned;
                    asg.sendEmailPeriodic = emailPeriodic;
                    asg.periodicDays = periodicDays;
                    asg.sendEmailNearDueDate = emailNearDueDate;
                    asg.nearDueDateDays = nearDueDateDays;
                    asg.sendEmailOnDueDate = emailOnDueDate;
                    asg.sendEmailOverdue = emailOverdue;
                    asg.overdueDays = overdueDays;
                    asg.timestamp = DateTime.Now;
                    db.Assignments.Add(asg);
                    db.SaveChanges();

                    //get new assignmentId
                    assignmentId = asg.assignmentId;
                }
                else //this is an update of existing assignment
                {
                    //update 
                    asg = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
                    asg.enabled = enabled;
                    asg.title = title;
                    asg.description = description;
                    asg.dueDate = dueDate;
                    asg.dueDaysAfterAssigned = dueDays;
                    if (dueDate != null && dueDays != null) asg.dueDaysAfterAssigned = null; //default to dueDate if both provided
                    asg.sendEmailOnAssigned = emailOnAssigned;
                    asg.sendEmailPeriodic = emailPeriodic;
                    asg.periodicDays = periodicDays;
                    asg.sendEmailNearDueDate = emailNearDueDate;
                    asg.nearDueDateDays = nearDueDateDays;
                    asg.sendEmailOnDueDate = emailOnDueDate;
                    asg.sendEmailOverdue = emailOverdue;
                    asg.overdueDays = overdueDays;
                    db.SaveChanges();
                }

                //set selected course
                if (courseId.Trim().Length > 0)
                {
                    db.Assignment_CoursesSet(assignmentId, courseId);
                }

                return JsonResponse.NoError;
            }
            catch (Exception e)
            {
                return JsonResponse.Error(e);
            }
            
        }

    }
}