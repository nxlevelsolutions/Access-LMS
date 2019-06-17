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
                lblError.Text = GetLocalResourceObject("ErrorInvalidEmail").ToString();
                return;
            }

            //check company code
            ClientSetting cs = ClientSettings.Get("astellas"); //CompanyCode.Text
            if (cs == null)
            {
                lblError.Visible = true;
                lblError.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorInvalidCompany").ToString();
                return;
            }
            else
            {
                //initialize user's unique connection string (company database)
                LmsUser.DBConnString = cs.EntityConnStr;
            }

            // Check if the user currently has a registered email address.
            lms_Entities db = new ClientDBEntities();
            User_Info_Result userInfo = db.User_Info(txtEmail.Text).FirstOrDefault();

            if (userInfo == null)
            {
                lblError.Visible = true;
                lblError.Text = GetLocalResourceObject("ErrorUnknownEmail").ToString();
            }
            else
            {
                string emailMsg = GetLocalResourceObject("EmailBody").ToString();
                string emailSubject = GetLocalResourceObject("EmailSubject").ToString();
                string emailSent = GetLocalResourceObject("EmailSent").ToString();

                Utilities.SendEmail(
                    ConfigurationManager.AppSettings.Get("SystemEmail"), 
                    txtEmail.Text, 
                    emailSubject,
                    string.Format(emailMsg, userInfo.password)
                );
                lblError.Visible = false;

                lblRequestPassword.ForeColor = System.Drawing.Color.Green;
                lblRequestPassword.Text = string.Format(emailSent, txtEmail.Text);
                Log.Info("Password emailed to: \"" + txtEmail.Text + "\"");
            }
        }
    }
}