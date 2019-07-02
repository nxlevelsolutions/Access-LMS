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
        public const string SORT_KEY = "s";

        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            //Debug.WriteLine("user page load size=" + UsersPager.PageSize + " index=" + UsersPager.PageIndex);

            ObjectParameter totalCount = new ObjectParameter("RecordCount", typeof(int));
            List <Users_All_Result> list = db.Users_All(UsersPager.PageIndex, UsersPager.PageSize, Request.QueryString[SORT_KEY], totalCount).ToList();
            UsersPager.RecordCount = Convert.ToInt32(totalCount.Value);

            rptUsers.DataSource = list;
            rptUsers.DataBind();
        }

    }

 
}