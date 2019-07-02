using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public partial class HistoryAll : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();
            List<User_UsageHistory_Result> history = db.User_UsageHistory(LmsUser.UserId).ToList();

            //translate labels
            foreach (User_UsageHistory_Result item in history)
            {
                switch (item.eventType)
                {
                    case 1: //SCORE
                        item.eventData = Resources.Global.LabelScore + "=" + item.eventData;
                        break;
                    case 2: //STARTED
                        item.eventData = Resources.Global.LabelStarted;
                        break;
                    case 3: //COMPLETED
                        item.eventData = Resources.Global.LabelCompleted;
                        break;
                }
            }

            rptEvents.DataSource = history;
            rptEvents.DataBind();
        }

        protected void lnkDownload_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("MyHistoryAll", rptEvents);
        }
    }
}