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
            List<User_UsageHistory_Result> history = db.User_UsageHistory(LmsUser.UserId, null, null).ToList();

            //translate labels
            foreach (User_UsageHistory_Result item in history)
            {
                switch ((UsageEventType)item.eventType)
                {
                    case UsageEventType.SCORE:  
                        item.eventData = Resources.Global.LabelScore + "=" + item.eventData;
                        break;
                    case UsageEventType.STARTED: 
                        item.eventData = Resources.Global.LabelStarted;
                        break;
                    case UsageEventType.COMPLETED: 
                        item.eventData = Resources.Global.LabelCompleted;
                        break;
                }
            }

            rptEvents.DataSource = history.Where(h => h.eventType == (int)UsageEventType.COMPLETED); //show ONLY completed events
            rptEvents.DataBind();
        }

        protected void lnkDownload_Click(object sender, EventArgs e)
        {
            Utilities.DownloadAsExcel("MyHistory", rptEvents);
        }
    }
}