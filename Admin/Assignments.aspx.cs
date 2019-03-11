using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Script.Services;
using System.Web.Services;
using NXLevel.LMS.DataModel;


namespace NXLevel.LMS.Admin
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

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string Delete(int? assignmentId)
        {
            lms_Entities db = new ClientDBEntities();
            db.Assignment_Delete(assignmentId);
            return JsonResponse.NoError;
        }

    }



}