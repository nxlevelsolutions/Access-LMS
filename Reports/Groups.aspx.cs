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
    public partial class Groups : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            rptCategories.DataSource = db.Categories.ToList();
            rptCategories.DataBind();
        }

        protected IEnumerable<Report_CategoryGroups_Result> GetGroups(int catId)
        {
            lms_Entities db = new ClientDBEntities();
            List<Report_CategoryGroups_Result> groups = db.Report_CategoryGroups(catId).ToList();
            return groups;
        }

        protected void lnkDownload_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("groups", rptCategories);
        }
    }
}