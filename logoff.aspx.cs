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
            Log.Info("User '" + LmsUser.UserId + "' logged off.");
            Session.Abandon();
            FormsAuthentication.SignOut();
            Response.Redirect("login.aspx");
        }
    }
}