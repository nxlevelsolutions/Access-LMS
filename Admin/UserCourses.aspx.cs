using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Admin
{
    public partial class UserCourses : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            int userId = int.Parse(Request.QueryString["uid"]);
       
            //load assigned courses
            var assigned = (from uc in db.Users_Courses
                            join c in db.Courses on uc.courseId equals c.courseId
                            where uc.userId == userId
                            select new {courseId = c.courseId, title = c.title}).ToList();

            var allCourses = (from c in db.Courses
                              select new { courseId = c.courseId, title = c.title }).ToList();
            var assignedIds = assigned.Select(x => x.courseId).ToArray();

            cblCourses.DataTextField = "title";
            cblCourses.DataValueField = "courseId";
            cblCourses.DataSource = allCourses;
            cblCourses.DataBind();
            foreach (ListItem item in cblCourses.Items)
            {
                item.Selected = assignedIds.Contains(short.Parse(item.Value));
            }
        }

        
        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveAssignedCourses(string courseIds)
        {
            //courseIds holds ALL the id's that the person is supposed have,
            //no more, no less.
            NameValueCollection qs = HttpUtility.ParseQueryString(HttpContext.Current.Request.UrlReferrer.Query);
            int userId = int.Parse(qs["uid"]);

            lms_Entities db = new ClientDBEntities();
            if (courseIds == "")
            {
                db.Users_Courses.RemoveRange(db.Users_Courses.Where(c => c.userId == userId)); //remove all assigned
            }
            else
            {
                //remove ones that are not specified
                int[] ids = courseIds.Split(',').Select(i => int.Parse(i)).ToArray();
                List<Users_Courses> assignedList = (from uc in db.Users_Courses
                                                    where uc.userId == userId
                                                    select uc).ToList();
                db.Users_Courses.RemoveRange(db.Users_Courses.Where(c => !ids.Contains(c.courseId) && c.userId == userId));

                //add ones that are not assigned yet
                for (int i = 0; i < ids.Length; i++)
                {
                    if (!assignedList.Exists(c => c.courseId == ids[i]))
                    {
                        db.Users_Courses.Add(new Users_Courses { courseId = ids[i], userId = userId });
                    }
                }
            }
            db.SaveChanges();

            return JsonResponse.NoError;
        }
    }
}