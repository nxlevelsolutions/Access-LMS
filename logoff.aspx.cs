using System;
using System.Web.Security;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace NXLevel.LMS
{
    public partial class logoff : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            Session.Abandon();
            FormsAuthentication.SignOut();
            LmsLog.Info("User '" + Session["ses_s_dispay_name"] + "' logged off.");
            Response.Redirect("login.aspx");
        }
    }
}