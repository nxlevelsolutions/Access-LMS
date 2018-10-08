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

        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            if (txtEmail.Text=="")
            {
                lblError.Visible = true;
                lblError.Text = "Please enter a valid email address.";
                return;
            }

            // Check if the user currently has a registered email address.
            User_Info_Result userInfo = db.User_Info(txtEmail.Text).FirstOrDefault<User_Info_Result>();

            if (userInfo == null)
            {
                lblError.Visible = true;
                lblError.Text = "The system does not have your email address. Please make sure it is spelled correctly.";
            }
            else
            {
                string emailMsg = Utilities.GetFileContents("Templates/ForgotPassword.html");
                emailMsg = string.Format(emailMsg, userInfo.password);

                Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), txtEmail.Text, "Pharmacertify access", emailMsg);
                lblError.Visible = false;

                lblRequestPassword.ForeColor = System.Drawing.Color.Green;
                lblRequestPassword.Text = "Your password was emailed to '" + txtEmail.Text + "'. If this is not your email address, please contact your administrator to have this corrected.";
            }
        }
    }
}