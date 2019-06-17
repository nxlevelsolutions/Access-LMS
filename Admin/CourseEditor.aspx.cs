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
    public partial class CourseEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? courseId = Utilities.TryToParseAsInt(Request.QueryString["cid"]);
            if (courseId != null)
            {
                lms_Entities db = new ClientDBEntities();
                Course crs = db.Courses.Where(c => c.courseId == courseId).FirstOrDefault();
                tbTitle.Text = crs.title;
                tbDescription.Text = crs.description;
                cbEnabled.Checked = crs.enabled;
                tbUrl.Text = crs.url;
                tbWidth.Text = crs.browserWidth.ToString();
                tbHeight.Text = crs.browserHeight.ToString();
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveCourse(
            string title, 
            string description, 
            bool enabled, 
            string url, 
            int? width,
            int? height
            )
        {
            string cid = Utilities.GetQueryString("cid");
            int? courseId = Utilities.TryToParseAsInt(cid);

            
 
            return JsonResponse.NoError;
        }

    }
}