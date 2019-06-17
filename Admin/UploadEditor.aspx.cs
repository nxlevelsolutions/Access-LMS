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
    public partial class UploadEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //int? courseId = Utilities.TryToParseAsInt(Request.QueryString["cid"]);
            //if (courseId != null)
            //{
            //    lms_Entities db = new ClientDBEntities();
            //    Course crs = db.Courses.Where(c => c.courseId == courseId).FirstOrDefault();
            //    tbTitle.Text = crs.title;
            //    tbDescription.Text = crs.description;
            //    cbEnabled.Checked = crs.enabled;
            //    tbUrl.Text = crs.url;
            //    if (crs.scorm)
            //    {
            //        rblType.Items[0].Selected = true;
            //    }
            //    else
            //    {
            //        if (crs.aicc) rblType.Items[1].Selected = true;
            //    }
            //    cbToolbar.Checked = crs.browserToolbar;
            //    cbStatus.Checked = crs.browserStatus;
            //    tbWidth.Text = crs.browserWidth.ToString();
            //    tbHeight.Text = crs.browserHeight.ToString();
            //}
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveCourse(
            string title, 
            string description, 
            bool enabled, 
            string url, 
            int type, 
            bool toolbar,
            bool status,
            int? width,
            int? height
            )
        {
            string cid = Utilities.GetQueryString("cid");
            int? courseId = Utilities.TryToParseAsInt(cid);

            lms_Entities db = new ClientDBEntities();
            if (courseId == null)
            {
                //this is a new course
                db.Courses.Add(new Course
                {
                    title = title,
                    description = description,
                    enabled = enabled,
                    scorm = (type == 0),
                    aicc = (type == 1),
                    url = url,
                    browserWidth = width,
                    browserHeight = height,
                    timestamp = DateTime.Now
                });
            }
            else
            {
                //this is an update
                Course csr = db.Courses.Where(u => u.courseId == courseId).FirstOrDefault();
                csr.title = title;
                csr.description = description;
                csr.enabled = enabled;
                csr.scorm = (type == 0);
                csr.aicc = (type == 1);
                csr.url = url;
                csr.browserWidth = width;
                csr.browserHeight = height;
            }
            db.SaveChanges();
            return JsonResponse.NoError;
        }

    }
}