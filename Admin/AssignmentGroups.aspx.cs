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
    public partial class AssignmentGroups : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? assignmentId = Utilities.TryToParseAsInt(Request.QueryString["aid"]);
            lms_Entities db = new ClientDBEntities();
            List<Assignment_GroupsGet_Result> allGroups = db.Assignment_GroupsGet(assignmentId).ToList();
            List<int> inAssignmentCourses = allGroups.Where(u => u.IsInAssignment == true).Select(u => u.groupId).ToList();
            cbGroups.DataSource = allGroups;
            cbGroups.DataBind();

            foreach (ListItem li in cbGroups.Items)
            {
                if (inAssignmentCourses.Contains(int.Parse(li.Value)))
                {
                    li.Selected = true;
                }
            }

            litNoResult.Visible = cbGroups.Items.Count == 0;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveGroups(string groupIds)
        {
            string aid = Utilities.getQueryString("aid");
            int? assignmentId = Utilities.TryToParseAsInt(aid);

            lms_Entities db = new ClientDBEntities();
            db.Assignment_GroupsSet(assignmentId, groupIds);
            return JsonResponse.NoError; 
        }

    }
}