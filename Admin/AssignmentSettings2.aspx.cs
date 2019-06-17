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
    public partial class AssignmentSettings2 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //load assignment settings
            int? assignmentId = Utilities.TryToParseAsInt(Request.QueryString["aId"]);
            if (assignmentId != null)
            {
                lms_Entities db = new ClientDBEntities();
                Assignment asg = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
                cbEnabled.Checked = asg.enabled;
                txtTitle.Text = asg.title;
                txtDescription.Text = asg.description;
                tbRegisterCode.Text = asg.registerCode;
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
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string Save(
            string title,
            string description,
            bool enabled, 
            string registerCode,
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

                //check if Registration Code is already used in another assignment
                if (registerCode?.Trim().Length > 0)
                {
                    asg = db.Assignments.Where(a => a.registerCode == registerCode && a.assignmentId != assignmentId).FirstOrDefault();
                    if (asg != null)
                    {
                        return JsonResponse.Error("The registration code entered is already in use. Please select another.");
                    }
                }

                if (assignmentId == null)
                {
                    //this is a new assignment
                    asg = new Assignment();
                    asg.type = (int)AssignmentType.LEARNING_PLAN;
                    asg.enabled = enabled;
                    asg.title = title;
                    asg.description = description;
                    asg.registerCode = registerCode.Trim();
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
                }
                else //this is an update of existing assignment
                {
                    //check if due date is in the future
                    //if (dueDate != null)
                    //{
                    //    if (((DateTime)dueDate).Subtract(DateTime.Today).Days < 1)
                    //    {
                    //        return JsonResponse.Error("The due date must be a future date. Please select another.");
                    //    }
                    //}

                    //update 
                    asg = db.Assignments.Where(a => a.assignmentId == assignmentId).FirstOrDefault();
                    asg.enabled = enabled;
                    asg.title = title;
                    asg.description = description;
                    //asg.allowSelfRegister = allowSelfRegister;
                    asg.registerCode = registerCode.Trim();
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


                return JsonResponse.NoError;
            }
            catch (Exception e)
            {
                return JsonResponse.Error(e);
            }

            
        }

    }
}