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
    public partial class CategoryEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int? categoryId = Utilities.TryToParseAsInt(Request.QueryString["cid"]);
            if (categoryId != null)
            {
                lms_Entities db = new ClientDBEntities();
                Category grp = db.Categories.Where(c => c.categoryId == categoryId).FirstOrDefault();
                tbTitle.Text = grp.title;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveCategory(string title)
        {
            string cid = Utilities.getQueryString("cid");
            int? categoryId = Utilities.TryToParseAsInt(cid);

            lms_Entities db = new ClientDBEntities();
            if (categoryId == null)
            {
                //this is a new course
                db.Categories.Add(new Category
                {
                    title = title,
                    timestamp = DateTime.Now
                });
            }
            else
            {
                //this is an update
                Category csr = db.Categories.Where(c => c.categoryId == categoryId).FirstOrDefault();
                csr.title = title;
            }
            db.SaveChanges();
            return JsonResponse.NoError;
        }

    }


}