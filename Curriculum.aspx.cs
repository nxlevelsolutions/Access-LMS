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

        List<User_Curriculum_Result> courses;

        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            courses = db.User_Curriculum(LmsUser.UserId).ToList();

            //get distinct assignment ids
            List<assignmentInfo> aIds = courses
                                .GroupBy(p => p.assignmentId)
                                .Select(g => g.First())
                                .Select(o => new assignmentInfo
                                {
                                    assignmentId = o.assignmentId,
                                    inOrder = o.availCoursesInOrder })
                                .ToList();

            //check if some courses should not be availabe to launch (but remain visible)  
            foreach (assignmentInfo asg in aIds)
            {
                int assignmentId = asg.assignmentId;
                if (asg.inOrder)
                {
                    //this is a sequenced assignment, get lowest orderId provided in given assignment NOT done 
                    int lowestOrderid = courses
                        .Where(c => c.assignmentId == assignmentId && c.completed == false)
                        .Min(r => r.orderId).Value;

                    //course.available is true by default, set to false if should not be available
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

            //render assignment list
            List<int> assigIds = courses.Select(c => c.assignmentId).Distinct().ToList();
            var assigIdsInfo = (from all in db.Assignments
                               join a in assigIds on all.assignmentId equals a
                               select new {
                                   assignmentId = all.assignmentId,
                                   title = all.title,
                                   description = all.description,
                                   type = all.type
                               }).ToList();

            rptAssignments.DataSource = assigIdsInfo;
            rptAssignments.DataBind();

        }

        protected IEnumerable<User_Curriculum_Result> GetCourses(int assignmentId)
        {
            return courses.Where(a => a.assignmentId==assignmentId).OrderBy(c => c.orderId).ToList();
        }

        private struct assignmentInfo{
            public int assignmentId;
            public bool inOrder;
        }

    }
}