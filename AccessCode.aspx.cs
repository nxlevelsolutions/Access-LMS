using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Security;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class AccessCode : System.Web.UI.Page
    {
        

        protected void Page_Load(object sender, EventArgs e)
        {
            lblErrMsg.Text = "";
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            // Verify user input.
            if (!Utilities.IsEmailValid(txtEmail.Text))
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = "Please enter a valid email address.";
                return;
            }

            if (!Utilities.IsPasswordValid(txtPwd1.Text))
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = "Your password must be alphanumeric and more than 6 characters long.";
                return;
            }

            if (txtPwd1.Text != txtPwd2.Text)
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = "Your passwords do not match. Please try again.";
                return;
            }

            if (txtAccessCode.Text=="")
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = "Please enter a valid Access Code.";
                return;
            }
        

            // check 
            lms_Entities db = new lms_Entities();
            User_Info_Result userInfo = db.User_Info(txtEmail.Text.Trim()).FirstOrDefault();
            if (userInfo == null)
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = "Error: Your email is not registered in the system.";
            }
            else
            {
                // user exists
                if (userInfo.activationCode == txtAccessCode.Text.Trim())
                {
                    // Activate the user's account.
                    userInfo.active = true;
                    userInfo.password = txtPwd1.Text.Trim();
                    db.SaveChanges();

                    // Set session items.
                    LmsUser.SetInfo(userInfo.userId, userInfo.accessId, userInfo.firstName, userInfo.lastName, userInfo.clientName, "", 123); //LMSUsr.connStr, LMSUsr.dbId

                    // Write the session data to the log.
                    Log.Info("User: " + LmsUser.UserId + " account verified. Logging in for the 1st time.");
                    FormsAuthentication.RedirectFromLoginPage(txtEmail.Text, false);
                }
                else
                {
                    lblErrMsg.Visible = true;
                    lblErrMsg.Text = "The Access Code you entered does not match our records. Please try again.";
                }
            }

 
        }
    }
}