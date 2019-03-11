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
    public partial class Group : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            rptUsers.DataSource = db.Report_AssignmentGroups(Utilities.TryToParseAsInt(Request.QueryString["gid"])).ToList();
            rptUsers.DataBind();
        }

        protected void lnkDownload_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("group-users", rptUsers);
        }
    }
}