using System;
using System.IO;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using NXLevel.LMS.DataModel;


namespace NXLevel.LMS.Admin
{
    public partial class Courses : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                RenderCourseList();
            }
        }

        private void RenderCourseList()
        {
            lms_Entities db = new ClientDBEntities();
            List<Courses_Avail_Result> list = db.Courses_Avail(null).ToList();
            rptCourseList.DataSource = list;
            rptCourseList.DataBind();
        }
        protected void BtnNewCourse_Click(object sender, EventArgs e)
        {
            //create empty course shell
            lms_Entities db = new ClientDBEntities();
            Course crs = new Course
            {
                type = (short) CourseType.SCORM, //default to scorm
                title = null,
                description = null,
                enabled = false,
                url = null,
                browserWidth = Utilities.TryToParseAsInt(ConfigurationManager.AppSettings["DefaultNewCourseWindowWidth"]), //use default width size
                browserHeight = Utilities.TryToParseAsInt(ConfigurationManager.AppSettings["DefaultNewCourseWindowHeight"]), //use default height size
                timestamp = DateTime.Now
            };
            db.Courses.Add(crs);
            db.SaveChanges();

            //render list
            Response.Redirect("courses.aspx?" + Utilities.AddQueryString("e", crs.courseId.ToString()));

        }

        public string StripRoot(object url, object courseId)
        {
            if (url == null)
            {
                return "";
            }
            else
            {
                string root = Global.WEBSITE_COURSES_FOLDER + "/" + LmsUser.companyFolder + "/" + courseId + "/";
                string manifestUrl = (string)url;
                if (manifestUrl.StartsWith(root))
                {
                    manifestUrl = manifestUrl.Substring(root.Length);
                }
                return manifestUrl;
            }
        }

        public string TypeName(object type)
        {
            switch ((short)type)
            {
                case (short)CourseType.AICC:
                    return "AICC";
                case (short)CourseType.SCORM:
                    return "SCORM";
                case (short)CourseType.READ_AND_SIGN:
                    return "READ & SIGN";
                default:
                    return "";
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string Save(
            int courseId,
            short type, 
            string title,
            string description,
            bool enabled,
            string startPage,
            int? width,
            int? height,
            string extra1,
            string extra2
            )
        {
            try
            {
                lms_Entities db = new ClientDBEntities();
                Course crs = db.Courses.Where(c => c.courseId == courseId).FirstOrDefault();
                crs.type = type;
                crs.title = title;
                crs.description = description;
                crs.enabled = enabled;
                crs.url = Global.WEBSITE_COURSES_FOLDER + "/" + LmsUser.companyFolder + "/" + courseId + "/" + startPage;
                crs.browserWidth = width;
                crs.browserHeight = height;
                crs.extra1 = extra1;
                crs.extra2 = extra2;
                db.SaveChanges();
                return JsonResponse.NoError;
            }
            catch (Exception e)
            {
                return JsonResponse.Error(e);
            }

        }


        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string Delete(int? courseId)
        {
            try
            {
                //delete db entry
                lms_Entities db = new ClientDBEntities();
                Course crs = db.Courses.Where(c => c.courseId == courseId).FirstOrDefault();
                db.Courses.Remove(crs);
                db.SaveChanges();

                //delete files
                string courseAbsPath = Path.Combine(new string[] {
                            HttpContext.Current.Server.MapPath("~/" + Global.WEBSITE_COURSES_FOLDER),
                            LmsUser.companyFolder,
                            courseId.ToString()
                        });
                if (Directory.Exists(courseAbsPath))
                {
                    Directory.Delete(courseAbsPath, true);
                }

                //all ok
                return JsonResponse.NoError;
            }
            catch (Exception e)
            {
                return JsonResponse.Error(e);
            }
        }

    }
}