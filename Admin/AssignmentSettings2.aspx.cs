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
                cbSelfRegister.Checked = asg.allowSelfRegister;
                tbRegisterCode.Text = asg.registerCode;
                txtDuedate.Text = asg.dueDate?.ToShortDateString();
                cbEmailOnAssigned.Checked = asg.sendEmailOnAssigned;
                cbEmailPeriodic.Checked = asg.sendEmailPeriodic;
                txtPeriodicDays.Text = asg.periodicDays?.ToString();
                cbEmailNearDueDate.Checked = asg.sendEmailNearDueDate;
                txtNearDueDateDays.Text = asg.nearDueDateDays?.ToString();
                cbEmailDueDate.Checked = asg.sendEmailOnDueDate;
                cbEmailOverdue.Checked = asg.sendEmailOverdue;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string Save(
            bool enabled, 
            bool allowSelfRegister, 
            string registerCode,
            DateTime? dueDate, 
            bool emailOnAssigned, 
            bool emailPeriodic, 
            string periodicDays, 
            bool emailNearDueDate, 
            string nearDueDateDays, 
            bool emailOnDueDate, 
            bool emailOverdue)
        {
            string aid = Utilities.getQueryString("aId");
            int? assignmentId = Utilities.TryToParseAsInt(aid);
            if (assignmentId == null)
            {
                return JsonResponse.Error("Configuration error.");
            }
            else //this is an update of existing assignment
            {
                lms_Entities db = new ClientDBEntities();
                Assignment asg;

                //check if Registration Code is already used in another assignment
                if (registerCode?.Trim().Length > 0)
                {
                    asg = db.Assignments.Where(a => a.registerCode == registerCode && a.assignmentId != assignmentId).FirstOrDefault();
                    if (asg != null)
                    {
                        return JsonResponse.Error("The registration code entered is already in use. Please select another.");
                    }
                }

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
                asg.allowSelfRegister = allowSelfRegister;
                asg.registerCode = registerCode;
                asg.dueDate = dueDate;
                asg.sendEmailOnAssigned = emailOnAssigned;
                asg.sendEmailPeriodic = emailPeriodic;
                asg.periodicDays = Utilities.TryToParseAsInt(periodicDays);
                asg.sendEmailNearDueDate = emailNearDueDate;
                asg.nearDueDateDays = Utilities.TryToParseAsInt(nearDueDateDays);
                asg.sendEmailOnDueDate = emailOnDueDate;
                asg.sendEmailOverdue = emailOverdue;
                db.SaveChanges();
                return JsonResponse.NoError;
            }
            
        }

    }
}