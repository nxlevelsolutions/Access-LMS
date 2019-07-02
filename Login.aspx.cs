using System;
using System.Configuration;
using System.Linq;
using System.Web.Security;
using System.Diagnostics;
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
            string email = Email.Text.Trim();

            if (!Utilities.IsEmailValid(email)) 
            {
                ErrorMsg.Visible = true;
                ErrorMsg.Text = GetLocalResourceObject("ErrorInvalidEmail").ToString();
                return;
            }

            //if (CompanyCode.Text.Trim()=="")
            //{
            //    ErrorMsg.Visible = true;
            //    ErrorMsg.Text = GetLocalResourceObject("ErrorNoCompany").ToString(); 
            //    return;
            //}

            //-------------------------------------------------
            //check company code - must have a valid company ID
            //-------------------------------------------------
            ClientSetting cs = ClientSettings.Get("astellas");
            if (cs == null)
            {
                ErrorMsg.Visible = true; 
                ErrorMsg.Text = GetLocalResourceObject("ErrorInvalidCompany").ToString();
                return;
            }
            else
            {
                if (cs.Enabled)
                {
                    //initialize user's unique connection string (company database)
                    //this should be done 1st before any db-specific call
                    LmsUser.DBConnString = cs.EntityConnStr;
                }
                else
                {
                    ErrorMsg.Visible = true; 
                    ErrorMsg.Text = GetLocalResourceObject("ErrorDisabledCompany").ToString();
                    return;
                }
            }


            lms_Entities db = new ClientDBEntities();
            User_Info_Result userInfo = db.User_Info(email).FirstOrDefault();

            if (userInfo == null)
            {
                //no email record found
                ErrorMsg.Visible = true; 
                ErrorMsg.Text = GetLocalResourceObject("ErrorUnknownEmail").ToString();
                Log.Info("Login:\"" + email + "\" invalid email address.");
            }
            else
            {
                //-------------------------------------------------
                // ALL USERS must have an activation code, ie. they
                // have to setup their new personal password
                //-------------------------------------------------
                if (string.IsNullOrEmpty(userInfo.activationCode))
                {
                    // Redirect the user to the access code page.
                    Response.Redirect("AccessCode.aspx?e=" + email + "&c=1");
                }
                else
                {
                    // user has an activation code, check if enabled
                    if (userInfo.enabled)
                    {
                        //user is enabled... check password
                        if (userInfo.password == Pwd.Text)
                        {
                            //password is good.. log user in
                            LmsUser.SetInfo(userInfo.userId, userInfo.firstName, userInfo.lastName, userInfo.role, cs.Name, cs.AssetsFolder);

                            // Write the session data to the log.
                            Log.Info(email + " has logged in. (SessionID=" + Session.SessionID + ")");
                            FormsAuthentication.RedirectFromLoginPage(email, false);
                        }
                        else
                        {
                            ErrorMsg.Visible = true;
                            ErrorMsg.Text = GetLocalResourceObject("ErrorInvalidPwd").ToString();
                            Log.Info("Login:\"" + email + "\" entered an incorrect password.");
                        }
                    }
                    else
                    {
                        //user account is disabled, so no access given
                        ErrorMsg.Visible = true;
                        ErrorMsg.Text = GetLocalResourceObject("ErrorDisabledAcct").ToString();
                        Log.Info("Login:\"" + email + "\" account is disabled.");
                    }
                }
            }
        }
    }
}