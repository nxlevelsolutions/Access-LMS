using System;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Diagnostics;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class Register : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {

            if (!Utilities.IsEmailValid(txtNewEmail.Text))
            {
                ErrorMsg.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorInvalidEmail").ToString();
                return;
            }


            //check company code
            ClientSetting cs = ClientSettings.Get("astellas");
            if (cs == null)
            {
                ErrorMsg.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorInvalidCompany").ToString();
                return;
            }
            else
            {
                //initialize user's unique connection string (company database)
                //this should be done 1st before any db-specific call
                LmsUser.DBConnString = cs.EntityConnStr;
            }


            //check if email is already in system
            lms_Entities db = new ClientDBEntities();
            User_Info_Result userInfo = db.User_Info(txtNewEmail.Text).FirstOrDefault();
            if (userInfo != null)
            {
                //email record found
                ErrorMsg.Text = GetLocalResourceObject("ErrorEmailExists").ToString();
                return;
            }


            //check if Registration code is valid
            Assignment asg = db.Assignments.Where(a => a.registerCode == txtRegisterCode.Text).SingleOrDefault();
            if (asg == null)
            {
                //unknown registration code
                ErrorMsg.Text = GetLocalResourceObject("ErrorRegCodeNotFound").ToString();
                return;
            }

            int assignmentId = asg.assignmentId;


            //create new user
            User usr = new User
            {
                enabled = true,
                firstName = txtFName.Text.Trim(),
                lastName = txtLName.Text.Trim(),
                email = txtNewEmail.Text.Trim(),
                //mgrEmail = txtMgrEmail.Text,
                title = txtTitle.Text.Trim(),
                //password = txtPwd1.Text,
                role = (int)Role.Learner,
                organization = ddOrganization.SelectedValue,
                timestamp = DateTime.Now
            };
            db.Users.Add(usr);
            db.SaveChanges();
            int userId = usr.userId;


            //assign user to this assignment 
            db.Assignment_UsersSet(assignmentId, userId.ToString(), true);


            //all done.. redirect to access page
            Response.Redirect("AccessCode.aspx?e=" + usr.email + "&c=1");
             
        }
    }
}