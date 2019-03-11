using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class History : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            rptEvents.DataSource = db.User_UsageHistory(LmsUser.UserId).ToList();
            rptEvents.DataBind();
        }

        protected void lnkDownload_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("myhistory", rptEvents);
        }
    }
}