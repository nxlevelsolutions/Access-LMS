using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.courses
{
    public partial class ReadAndSign : System.Web.UI.Page
    {
        int? courseId;
        protected void Page_Load(object sender, EventArgs e)
        {
            courseId = Utilities.TryToParseAsInt(Request.QueryString["cid"]);
            if (!IsPostBack)
            {
                //fetch course data
                lms_Entities db = new ClientDBEntities();
                Course crs = db.Courses.Where(c => c.courseId == courseId).FirstOrDefault();
                lblInstructions.Text = crs.extra1;  //extra1 is specific to ReadAndSign to mean "instructions"
                btnAccept.Text = crs.extra2;        //extra2 is specific to ReadAndSign to mean "button label" used in the Accept button

                //hide show controls
                string root = Global.WEBSITE_COURSES_FOLDER + "/" + LmsUser.companyFolder + "/" + courseId + "/";
                if (crs.url.Length==root.Length)
                {
                    lnkViewAsset.Visible = false;
                }
                else
                {
                    ViewState["FileUrl"] = crs.url;
                    btnAccept.Attributes.Add("disabled", "disabled");
                }

            }
        }

        protected void lnkViewAsset_Click(object sender, EventArgs e)
        {
            //get file
            string fileName = "../" + ViewState["FileUrl"].ToString();
            //if (Request.Browser?.Browser == "IE") fileName = HttpUtility.UrlPathEncode(fileName);
            fileName = MapPath(fileName);

            //display file
            FileInfo fi = new FileInfo(fileName);
            Response.Clear();
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            if (fi.Exists)
            {
                //send file to browser
                //Response.AddHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
                Response.AddHeader("Content-Type", "application/" + fi.Extension.Substring(1));
                Response.AddHeader("Content-Length", fi.Length.ToString());
                Response.WriteFile(fileName);
            }
            else
            {
                //show error
                Response.Write("Configuration error: asset '" + ViewState["FileUrl"].ToString() + "' was not found.");
                Log.Error("ReadAndSign display error:\"" + fileName + "\" was not found");
            }
            Response.Flush();
            Response.End();
        }

        protected void btnAccept_Click(object sender, EventArgs e)
        {
            btnAccept.Attributes.Remove("disabled");
            lblThankYou.Visible = true;
            //if (runMode.Value == "1")
            //{
            //    this is NOT in demo mode; mark course completed
            //    lms_Entities db = new ClientDBEntities();
            //    int? userId = Utilities.TryToParseAsInt(Request.QueryString["uid"]);
            //    int? affected = db.Course_ScormValueSet(userId, assignmentId, courseId, "CMI.CORE.LESSON_STATUS", Request.Form["data"]).FirstOrDefault();
            //}

        }
    }
}