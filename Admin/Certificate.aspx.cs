using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Admin
{
    public partial class Certificate : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int courseId = int.Parse(Request.QueryString["cid"]);
            int assignmentId = int.Parse(Request.QueryString["aid"]);

            //'--------------------------------------------------------
            //'Get Database info to display in PDF
            //'--------------------------------------------------------
            lms_Entities db = new ClientDBEntities();
            Course_BasicInfo_Result basInfo = db.Course_BasicInfo(assignmentId, courseId, LmsUser.UserId).FirstOrDefault();

            //'--------------------------------------------------------
            //'Fill out PDF and send to client browser
            //'--------------------------------------------------------
            PdfReader pdf = new PdfReader(Server.MapPath("certificate.pdf"));
            PdfStamper ps = new PdfStamper(pdf, Response.OutputStream);
            ps.FormFlattening = true;
            Response.ContentType = "application/pdf";
            Response.AddHeader("Content-Disposition", "attachment; filename=certificate.pdf");
            AcroFields af = ps.AcroFields;
            if (basInfo.completedDate != null)
            {
                af.SetField("CourseName", basInfo.title);
                af.SetField("StudentName", LmsUser.Firstname + " " + LmsUser.Lastname);
                af.SetField("CertificateDate", ((DateTime)basInfo.completedDate).ToLongDateString());
            }
            ps.Close();
        }
    }
}