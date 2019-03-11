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

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {

            //check email
            if (txtEmail.Text == "")
            {
                lblError.Visible = true;
                lblError.Text = "Please enter a valid email address.";
                return;
            }

            //check company code
            if (ConfigurationManager.AppSettings.Get(CompanyCode.Text) == null)
            {
                lblError.Visible = true;
                lblError.Text = "Please enter a valid company code.";
                return;
            }
            else
            {
                //initialize user's unique connection string (company database)
                LmsUser.DBConnString = ConfigurationManager.AppSettings.Get(CompanyCode.Text);
            }

            // Check if the user currently has a registered email address.
            lms_Entities db = new ClientDBEntities();
            User_Info_Result userInfo = db.User_Info(txtEmail.Text).FirstOrDefault<User_Info_Result>();

            if (userInfo == null)
            {
                lblError.Visible = true;
                lblError.Text = "The system does not have that email address associated with that company code. Please ensure both are correct.";
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