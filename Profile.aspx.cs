using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class Profile : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                lms_Entities db = new ClientDBEntities();
                User p = db.Users.Where(u => u.userId == LmsUser.UserId).FirstOrDefault();
                FName.Text = p.firstName;
                LName.Text = p.lastName;
                Pwd1.Text = p.password;
                Pwd2.Text = p.password;
                Email.Text = p.email;

                //Pwd1.Attributes["type"] = "password";
                //Pwd2.Attributes["type"] = "password";
            }
        }

        protected void btnSubmit_Click(object sender, EventArgs e)
        {
            Msg.Visible = true;

            //check password
            if (Pwd1.Text!= Pwd2.Text)
            {
                Msg.Text = GetLocalResourceObject("ErrorPwdNoMatch").ToString(); 
                return;
            }
            if (!Utilities.IsPasswordValid(Pwd1.Text))
            {
                Msg.Text = GetLocalResourceObject("ErrorInvalidPwd").ToString(); 
                return;
            }

            //update user info
            lms_Entities db = new ClientDBEntities();
            User p = db.Users.Where(u => u.userId == LmsUser.UserId).FirstOrDefault();
            p.firstName = FName.Text;
            p.lastName = LName.Text;
            p.password = Pwd1.Text;
            db.SaveChanges();
            Msg.Text = GetLocalResourceObject("RecordSaved").ToString();
        }
    }
}