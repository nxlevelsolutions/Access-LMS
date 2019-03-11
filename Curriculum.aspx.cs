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
            lms_Entities db = new ClientDBEntities();
            List<User_Curriculum_Result> courses = db.User_Curriculum(LmsUser.UserId).ToList();

            //get distinct assignment ids
            List<dynamic> aIds = courses
                                .GroupBy(p => p.assignmentId)
                                .Select(g => g.First())
                                .Select(o => new { assignmentId = o.assignmentId, availCoursesInOrder = o.availCoursesInOrder })
                                .ToList<dynamic>();

            //check if some courses should not be availabe to launch (but remain visible)  
            foreach (dynamic obj in aIds)
            {
                int assignmentId = obj.assignmentId;
                if (obj.availCoursesInOrder)
                {
                    //this is a sequenced assignment, get lowest orderId provided in given assignment NOT done 
                    int lowestOrderid = courses
                        .Where(c => c.assignmentId == assignmentId && c.completed == false)
                        .Min(r => r.orderId).Value;

                    //course.available is true by default, turn false if out of sequence
                    courses = courses
                        .Select(c => {
                            if (c.assignmentId == assignmentId && c.completed == false && c.orderId > lowestOrderid)
                            {
                                c.available = false;
                            }
                            return c;
                        })
                        .ToList();
                }
            }

            //render
            rptCourses.DataSource = courses;
            rptCourses.DataBind();
        }
    }
}