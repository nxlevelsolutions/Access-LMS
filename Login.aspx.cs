using System;
using System.Configuration;
using System.Linq;
using System.Web.Security;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class Login : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
             
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            if (!Utilities.IsEmailValid(Email.Text)) 
            {
                ErrorMsg.Visible = true;
                ErrorMsg.Text = "Please enter a valid email address.";
                return;
            }

            lms_Entities db = new lms_Entities();
            User_Info_Result userInfo = db.User_Info(Email.Text).FirstOrDefault();

            if (userInfo == null)
            {
                //no email record found
                ErrorMsg.Visible = true;
                ErrorMsg.Text = "Error: Invalid email address. Please enter a valid email address."; 
            }
            else
            {
                //there is a user record..check status
                if (userInfo.active)
                {
                    //user is active.. check password
                    if (userInfo.password == Pwd.Text)
                    {
                        //password is good.. log user in
                        LmsUser.SetInfo(userInfo.userId, userInfo.accessId, userInfo.firstName, userInfo.lastName, userInfo.clientName, "", 123); //LMSUsr.connStr, LMSUsr.dbId

                        // Write the session data to the log.
                        Log.Info("User: " + userInfo.userId + " logged in.");
                        FormsAuthentication.RedirectFromLoginPage(Email.Text, false);
                    }
                    else
                    {
                        ErrorMsg.Visible = true;
                        ErrorMsg.Text = "Error: You have entered an incorrect password.";
                    }
                }
                else
                {
                    //user is NOT active.. check activation code
                    if (string.IsNullOrEmpty(userInfo.activationCode))
                    {
                        // This is the first time logging in, so generate an access code.
                        string activationCode = Utilities.RandomAccessCode();

                        // Email the user the activation code.
                        string emailBody = Utilities.GetFileContents("Templates/AccessCode.html");
                        emailBody = string.Format(emailBody,
                                                activationCode,
                                                "http://" + Request.ServerVariables["HTTP_HOST"] + Request.ApplicationPath + "/AccessCode.aspx",
                                                "http://" + Request.ServerVariables["HTTP_HOST"]);
                        Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), Email.Text, "PharmaCertify Account Activation Instructions", emailBody);
                        Log.Info("Access code: " + activationCode + " was sent.");

                        // Update the user's account with the Activation Code.
                        userInfo.activationCode = activationCode;
                        db.SaveChanges();

                        // Redirect the user to the explanation page.
                        Response.Redirect("AccessCode.aspx");
                    }
                    else
                    {
                        ErrorMsg.Visible = true;
                        ErrorMsg.Text = "Error: Your account is disabled.";
                    }
                }
            }
        }
    }
}