using System;
using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Security;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class AccessCode : System.Web.UI.Page
    {
        

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lblErrMsg.Text = "";
                var email = Request.QueryString["e"];
                if (email != null)
                {
                    txtEmail.Text = email;
                    if (Request.QueryString["c"] == "1") //code 1.. send activation, if possible
                    {
                        //don't keep sending access code on refresh
                        ClientSetting cs = ClientSettings.Get("astellas");
                        LmsUser.DBConnString = cs.EntityConnStr;
                        lms_Entities db = new ClientDBEntities();

                        User usr = db.Users.Where(u => u.email == email).FirstOrDefault();
                        if (usr.activationCode == null)
                        {
                            SendNewActivationCode(email);
                        }
                        
                    }
                }
            }
        }

        protected void SendNewActivationCode(string email)
        {
            ClientSetting cs = ClientSettings.Get("astellas");
            LmsUser.DBConnString = cs.EntityConnStr;
            lms_Entities db = new ClientDBEntities();

            // This is the first time logging in, so generate an access code.
            string activationCode = Utilities.RandomAccessCode();

            // Email the user the activation code.
            string emailBody = GetLocalResourceObject("EmailBody").ToString();
            string emailSubject = GetLocalResourceObject("EmailSubject").ToString();
            emailBody = string.Format(emailBody,
                                    activationCode,
                                    Request.Url.Scheme + "://" + Request.ServerVariables["HTTP_HOST"] + Request.ApplicationPath + "/AccessCode.aspx",
                                    Request.Url.Scheme + "://" + Request.ServerVariables["HTTP_HOST"]);
            Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), email, emailSubject, emailBody);
            Log.Info("Access code: " + activationCode + " was sent to " + email);

            // Update the user's account with the Activation Code.
            User usr = db.Users.Where(u => u.email == email).FirstOrDefault();
            usr.activationCode = activationCode;
            db.SaveChanges();
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            // Verify user input.
            if (!Utilities.IsEmailValid(txtEmail.Text))
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorInvalidEmail").ToString();
                return;
            }

            if (!Utilities.IsPasswordValid(txtPwd1.Text))
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = HttpContext.GetLocalResourceObject("~/Profile.aspx", "ErrorInvalidPwd").ToString(); 
                return;
            }

            if (txtPwd1.Text != txtPwd2.Text)
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = HttpContext.GetLocalResourceObject("~/Profile.aspx", "ErrorPwdNoMatch").ToString();
                return;
            }

            if (txtAccessCode.Text=="")
            {
                lblErrMsg.Visible = true; 
                lblErrMsg.Text = GetLocalResourceObject("ErrorInvalidAccessCode").ToString();
                return;
            }

            //if (txtCompanyCode.Text == "")
            //{
            //    lblErrMsg.Visible = true;
            //    lblErrMsg.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorInvalidCompany").ToString();
            //    return;
            //}

            ClientSetting cs = ClientSettings.Get("astellas"); //txtCompanyCode.Text
            if (cs == null)  
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorInvalidCompany").ToString();
                return;
            }
            else
            {
                if (!cs.Enabled)
                {
                    lblErrMsg.Visible = true;
                    lblErrMsg.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorDisabledCompany").ToString();
                    return;
                }
            }

            //initialize connection string
            LmsUser.DBConnString = cs.EntityConnStr;

            // check 
            lms_Entities db = new ClientDBEntities();
            User_Info_Result userInfo = db.User_Info(txtEmail.Text.Trim()).FirstOrDefault();
            if (userInfo == null)
            {
                lblErrMsg.Visible = true;
                lblErrMsg.Text = HttpContext.GetLocalResourceObject("~/Login.aspx", "ErrorUnknownEmail").ToString(); //"Error: Your email is not registered in the system.";
            }
            else
            {
                // user exists
                if (userInfo.activationCode == txtAccessCode.Text.Trim())
                {
                    // activate the user's account.
                    User usr = db.Users.Where(u => u.userId == userInfo.userId).FirstOrDefault();
                    usr.enabled = true;
                    usr.password = txtPwd1.Text.Trim();
                    db.SaveChanges();

                    // set session items.
                    LmsUser.SetInfo(userInfo.userId, userInfo.firstName, userInfo.lastName, userInfo.role, cs.Name, cs.AssetsFolder);

                    // write the session data to the log.
                    Log.Info("User: " + LmsUser.UserId + " account verified. Logging in for the 1st time.");
                    FormsAuthentication.RedirectFromLoginPage(txtEmail.Text, false);
                }
                else
                {
                    lblErrMsg.Visible = true;
                    lblErrMsg.Text = GetLocalResourceObject("ErrorInvalidAccessCode").ToString();
                }
            }

 
        }
    }
}