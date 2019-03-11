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
    public partial class GroupEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? groupId = Utilities.TryToParseAsInt(Request.QueryString["gid"]);
            if (groupId != null)
            {
                lms_Entities db = new ClientDBEntities();
                Group grp = db.Groups.Where(c => c.groupId == groupId).FirstOrDefault();
                tbTitle.Text = grp.title;
                cbEnabled.Checked = grp.enabled;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveGroup(string title, bool enabled)
        {
            NameValueCollection qs = HttpUtility.ParseQueryString(HttpContext.Current.Request.UrlReferrer.Query);
            int? groupId = Utilities.TryToParseAsInt(qs["gid"]);
            int? categoryId = Utilities.TryToParseAsInt(qs["cid"]);

            lms_Entities db = new ClientDBEntities();
            db.Categories_GroupsSet(categoryId, groupId, title, enabled);

            return JsonResponse.NoError;
        }
    }
}