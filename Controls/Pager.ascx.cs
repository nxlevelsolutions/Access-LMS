using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace NXLevel.LMS.Controls
{
    public partial class Pager : System.Web.UI.UserControl
    {
        public int PageIndex;
        public int PageSize;
        public int PageTotal;
        public int RecordCount;

        public const string KEY_PAGE_INDEX = "pi";
        public const string KEY_PAGE_SIZE = "ps";

        protected void Page_Load(object sender, EventArgs e)
        {
            // set drop down list
            ddlPageSize.SelectedValue = PageSize.ToString();
            RenderPager();
        }

        protected void Page_Init(object sender, System.EventArgs e)
        {
            // process PageSize dropdown list
            if (Request.QueryString[KEY_PAGE_SIZE] == null)
            {
                PageSize = int.Parse(ddlPageSize.SelectedValue);
            }
            else
            {
                PageSize = int.Parse(Request.QueryString[KEY_PAGE_SIZE]);
            }

            // process user click on a random page, back or next
            if (Request.QueryString[KEY_PAGE_INDEX] == null)
            {
                PageIndex = 1;
            }
            else
            {
                PageIndex = int.Parse(Request.QueryString[KEY_PAGE_INDEX]);
            }

            Debug.WriteLine("Pager Init Event: PageSize=" + PageSize + ", PageIndex =" + PageIndex);
        }

        private void RenderPager()
        {
            int pageCount = (int) Math.Ceiling(((float)RecordCount) / PageSize);
            PageTotal = pageCount;
            if (PageIndex > PageTotal) PageIndex = PageTotal;
            int[] DisplayList = new int[pageCount];
            for (int i = 0; i < pageCount; i++)
            {
                DisplayList[i] = i + 1;
            }
            RptPages.DataSource = DisplayList;
            RptPages.DataBind();
        }
    }
     
}