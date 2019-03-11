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
    public partial class AssignmentUsers : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? assignmentId = Utilities.TryToParseAsInt(Request.QueryString["aid"]);
            lms_Entities db = new ClientDBEntities();
            List<Assignment_UsersGet_Result> users = db.Assignment_UsersGet(assignmentId).ToList();
            List<int> inAssignmentUsers = users.Where(u => u.IsInAssignment == true).Select(u => u.userId).ToList();
            List<int> inGroupUsers = users.Where(u => u.IsInGroup == true).Select(u => u.userId).ToList();
            cbUsers.DataSource = users;
            cbUsers.DataBind();

            foreach (ListItem li in cbUsers.Items)
            {
                if (inAssignmentUsers.Contains(int.Parse(li.Value)))
                {
                    li.Selected = true;
                }
                if (inGroupUsers.Contains(int.Parse(li.Value)))
                {
                    li.Selected = true;
                    li.Enabled = false;
                }
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveUsers(string userIds)
        {
            string aid = Utilities.getQueryString("aid");
            int? assignmentId = Utilities.TryToParseAsInt(aid);

            lms_Entities db = new ClientDBEntities();
            db.Assignment_UsersSet(assignmentId, userIds);
            return JsonResponse.NoError;
        }
    }
}