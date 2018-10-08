using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Objects;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Caching;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;


namespace NXLevel.LMS.Admin
{
    public partial class Users : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            ObjectParameter totalCount = new ObjectParameter("RecordCount", typeof(int));
            lms_Entities db = new lms_Entities();
            List<Users_All_Result> list;
            string cacheKey = UsersPager.PageSize + "_key_" + UsersPager.PageIndex;
            var data = Page.Cache[cacheKey];
            Debug.WriteLine("user page load size=" + UsersPager.PageSize + " index=" + UsersPager.PageIndex);

            if (Page.IsPostBack && data != null)
            {
                list = (List<Users_All_Result>) data;
                UsersPager.RecordCount = Convert.ToInt32(ViewState["RecordCount"]);
                Debug.WriteLine("user page loading from cache " + cacheKey);
            }
            else
            {
                list = db.Users_All(UsersPager.PageIndex, UsersPager.PageSize, totalCount).ToList();
                UsersPager.RecordCount = Convert.ToInt32(totalCount.Value);
                Page.Cache.Insert(cacheKey, list, null, DateTime.Now.AddSeconds(60), Cache.NoSlidingExpiration);
                ViewState["RecordCount"] = totalCount.Value;
                Debug.WriteLine("user page loading from db");
            }
            
            UsersList.DataSource = list;
            UsersList.DataBind();

        }

    }

 
}