using System;
using System.Configuration;
using System.Linq;
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
            if (!Utilities.IsEmailValid(txtEmail.Text))
            {
                ErrorMsg.Text = "Please enter a valid email address.";
                return;
            }


            //check company code
            ClientSetting cs = ClientSettings.Get(txtCompanyCode.Text);
            if (cs == null)
            {
                ErrorMsg.Text = "Please enter a valid company code.";
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
            User_Info_Result userInfo = db.User_Info(txtEmail.Text).FirstOrDefault();
            if (userInfo != null)
            {
                //email record found
                ErrorMsg.Text = "The email entered is already registered in the system.";
                return;
            }


            //check if Registration code is valid
            Assignment asg = db.Assignments.Where(a => a.registerCode == txtRegisterCode.Text).SingleOrDefault();
            if (asg == null)
            {
                //unknown registration code
                ErrorMsg.Text = "The Registration Code entered is unknown.";
                return;
            }
            if (asg.allowSelfRegister == false)
            {
                ErrorMsg.Text = "The Registration Code entered is no longer active.";
                return;
            }
            int assignmentId = asg.assignmentId;


            //create new user
            User usr = new User
            {
                enabled = true,
                firstName = txtFName.Text,
                lastName = txtLName.Text,
                email = txtEmail.Text,
                mgrEmail = txtMgrEmail.Text,
                title = txtTitle.Text,
                password = txtPwd1.Text,
                role = (int)Role.Learner,
                timestamp = DateTime.Now
            };
            db.Users.Add(usr);
            db.SaveChanges();
            int userId = usr.userId;


            //assign user to this assignment 
            db.Assignment_UsersSet(assignmentId, userId.ToString());


            //all done 
            ErrorMsg.Text = "Success! Please return to the login page and login using your submitted credentials.";
            btnSubmit.Enabled = false;
        }
    }
}