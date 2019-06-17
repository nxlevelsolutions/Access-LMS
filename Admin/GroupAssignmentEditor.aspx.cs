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
    public partial class GroupAssignmentEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? groupId = Utilities.TryToParseAsInt(Request.QueryString["gid"]);
            lms_Entities db = new ClientDBEntities();
            List<Group_UsersGet_Result> allItems = db.Group_UsersGet(groupId).ToList();
            List<int> inGroupUsers = allItems.Where(u => u.IsInGroup == true).Select(u => u.userId).ToList();
            cbUsers.DataSource = allItems;
            cbUsers.DataBind();

            foreach (ListItem li in cbUsers.Items)
            {
                if (inGroupUsers.Contains(int.Parse(li.Value)))
                {
                    li.Selected = true;
                }
            }

        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveUsers(string userIds)
        {
            string gid = Utilities.GetQueryString("gid");
            int ? groupId = Utilities.TryToParseAsInt(gid);

            lms_Entities db = new ClientDBEntities();
            db.Group_UsersSet(groupId, userIds);
            return JsonResponse.NoError;
        }

    }
}