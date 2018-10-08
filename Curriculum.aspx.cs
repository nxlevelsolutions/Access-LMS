using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class Curriculum : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new lms_Entities();
            List<User_Curriculum_Result> courses = db.User_Curriculum(LmsUser.UserId).ToList();
            rptCourses.DataSource = courses;
            rptCourses.DataBind();
        }
    }
}