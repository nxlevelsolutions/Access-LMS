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

            //load courses
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
                txtDuedate.Text = asg.dueDate?.ToShortDateString();
                cbEmailOnAssigned.Checked = asg.sendEmailOnAssigned;
                cbEmailPeriodic.Checked = asg.sendEmailPeriodic;
                txtPeriodicDays.Text = asg.periodicDays?.ToString();
                cbEmailNearDueDate.Checked = asg.sendEmailNearDueDate;
                txtNearDueDateDays.Text = asg.nearDueDateDays?.ToString();
                cbEmailDueDate.Checked = asg.sendEmailOnDueDate;
                cbEmailOverdue.Checked = asg.sendEmailOverdue;

                //get selected course
                List<Assignment_CoursesGet_Result> allCourses = db.Assignment_CoursesGet(assignmentId).ToList();
                if (allCourses.Count > 0)
                {
                    Assignment_CoursesGet_Result course = allCourses[0];
                    ddlCourses.SelectedValue = course.courseId.ToString();
                }

            }

        }
    }
}