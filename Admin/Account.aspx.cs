using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class Account : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new lms_Entities();
            int userId = (int)Session["userId"];
            User p = db.Users.Where(u => u.userId == userId).FirstOrDefault();
            FName.Text = p.firstName;
            LName.Text = p.lastName;
            Pwd1.Text = p.password;
            Pwd2.Text = p.password;

            Pwd1.Attributes["type"] = "password";
            Pwd2.Attributes["type"] = "password";
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            lms_Entities db = new lms_Entities();
            int userId = (int)Session["userId"];
            User p = db.Users.Where(u => u.userId == userId).FirstOrDefault();
            p.firstName = FName.Text;
            p.lastName = LName.Text;
            p.password = Pwd1.Text;
            db.SaveChanges();
            Msg.Text = "Record saved.";
        }
    }
}