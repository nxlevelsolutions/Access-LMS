using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Security;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class AccessCode : System.Web.UI.Page
    {
        private lms_Entities db = new lms_Entities();

        protected void Page_Load(object sender, EventArgs e)
        {
            lblAccessCodeError.Text = string.Empty;
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {

            string errorMessage = "";

            // Verify user input.
            if (txtEmail.Text=="")
            {
                lblAccessCodeError.Text = "Please enter a valid email address.";
                return;
            }

            if (txtPassword.Text == "")
            {
                lblAccessCodeError.Text = "Please enter your new password.";
                return;
            }

            if (!Utilities.IsEmailValid(txtEmail.Text))
            {
                lblAccessCodeError.Text = "Please enter a valid email address.";
                return;
            }

            if (!Utilities.IsPasswordValid(txtPassword.Text))
            {
                lblAccessCodeError.Text = "Your password must be alphanumeric and more than 5 characters long.";
                return;
            }

            if (txtPassword.Text != txtPasswordConfirmation.Text)
            {
                lblAccessCodeError.Text = "Your passwords do not match.";
                return;
            }

            if (txtAccessCode.Text=="")
            {
                lblAccessCodeError.Text = "Please enter a valid Access Code.";
                return;
            }

            if (txtPassword.Text=="")
            {
                lblAccessCodeError.Text = "Please enter your password.";
                return;
            }

            // check 
            User_InfoGet_Result userInfo = db.User_InfoGet(txtEmail.Text.Trim()).FirstOrDefault();
            if (userInfo == null)
            {
                errorMessage = "Error: Invalid email address. Please enter a valid email address.";
                lblAccessCodeError.Text = errorMessage;
                return;
            }

            if (userInfo.activationCode == txtAccessCode.Text.Trim())
            {
                // Activate the user's account.
                userInfo.active = true;
                userInfo.password = txtPassword.Text.Trim();
                db.SaveChanges();

                // Set session items.
                Session["ActiveSession"] = true;
                Session["UserId"] = userInfo.userId;
                Session["DisplayName"] = userInfo.firstName + " " + userInfo.lastName;
                Session["AccessLevel"] = userInfo.accessId;

                // Write the session data to the log.
                LmsLog.Info("User: " + Session["DisplayName"] + " account verified. Logging in for the 1st time.");
            }
            else
            {
                errorMessage = "The Access Code you entered does not match our records. Please try again.";
            }

            if (errorMessage.Length == 0)
            {
                FormsAuthentication.RedirectFromLoginPage(txtEmail.Text, false);
            }
            else
            {
                lblAccessCodeError.Text = errorMessage;
            }
        }
    }
}