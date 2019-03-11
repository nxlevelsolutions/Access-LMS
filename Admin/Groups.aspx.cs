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
    public partial class Groups : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            rptCategories.DataSource = db.Categories.ToList();
            rptCategories.DataBind();
        }

        protected IEnumerable<Categories_GroupsGet_Result> GetGroups(int catId)
        {
            lms_Entities db = new ClientDBEntities();
            List<Categories_GroupsGet_Result> groups = db.Categories_GroupsGet(catId).ToList();
            return groups;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string DeleteItem(int? categoryId, int? groupId)
        {
            lms_Entities db = new ClientDBEntities();
            db.Categories_GroupsDelete(categoryId, groupId);
            return JsonResponse.NoError;
        }
    }


}