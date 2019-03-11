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
    public partial class Assignments : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            rptAssignments1.DataSource = db.AssignmentsStats((int)AssignmentType.SINGLE_COURSE).ToList();
            rptAssignments1.DataBind();

            rptAssignments2.DataSource = db.AssignmentsStats((int)AssignmentType.LEARNING_PLAN).ToList();
            rptAssignments2.DataBind();
        }

        protected void lnkDownload1_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("assignments", rptAssignments1);
        }

        protected void lnkDownload2_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("learning-plans", rptAssignments2);
        }
    }
}