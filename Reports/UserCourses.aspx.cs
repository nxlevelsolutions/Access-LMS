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

namespace NXLevel.LMS.Reports
{
    public partial class UserCourses : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            rptCourses.DataSource = db.Report_UserCourses(Utilities.TryToParseAsInt(Request.QueryString["uid"])).ToList();
            rptCourses.DataBind();
        }

        protected void lnkDownload_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("user-courses", rptCourses);
        }
    }
}