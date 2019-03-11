using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Admin
{
    public partial class EmailEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? emailId = Utilities.TryToParseAsInt( Request.QueryString["emailId"]);
            lms_Entities db = new ClientDBEntities();
            Email emailData = db.Emails.Where(r => r.emailId == emailId).FirstOrDefault();
            Subject.Text = emailData.subject;
            Editor.Text = emailData.body;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveEmail(string subject, string contents)
        {
            string id = Utilities.getQueryString("emailId");
            int? emailId = Utilities.TryToParseAsInt(id);
            
            if (emailId != null)
            {
                lms_Entities db = new ClientDBEntities();
                Email emailData = db.Emails.Where(r => r.emailId == emailId).FirstOrDefault();
                emailData.subject = subject;
                emailData.body = contents;
                db.SaveChanges();
                return "1";
            }
            
            return "0";
        }

    }
}