using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class RequestPassword : System.Web.UI.Page
    {
        private lms_Entities db = new lms_Entities();

        protected void Page_Load(object sender, EventArgs e)
        {
            lblError.Text = string.Empty;
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            string emailMessage = string.Empty;
            if (txtEmail.Text=="")
            {
                lblError.Text = "Please enter a valid email address.";
                return;
            }

            // Check if the user currently has a registered email address.
            User_InfoGet_Result userInfo = db.User_InfoGet(txtEmail.Text).FirstOrDefault<User_InfoGet_Result>();

            if (userInfo == null)
            {
                lblError.Text = "The system does not have your email address. Please make sure it is spelled correctly.";
            }
            else
            {
                emailMessage = Utilities.GetFileContents("Templates/ForgotPassword.html");
                emailMessage = string.Format(emailMessage, userInfo.password);

                Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), txtEmail.Text, "Pharmacertify access", emailMessage);
                lblError.Text = "";

                lblRequestPassword.Style.Add("color", "#008000");
                lblRequestPassword.Text = "Your password was emailed to '" + txtEmail.Text + "'. If this is not your email address, please contact your administrator to have this corrected.";
            }
        }
    }
}