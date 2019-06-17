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
    public partial class UserEditor : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            lms_Entities db = new ClientDBEntities();

            lstGroups.DataSource = db.Assignment_GroupsGet(null).ToList();
            lstGroups.DataBind();

            int? userId = Utilities.TryToParseAsInt(Request.QueryString["uid"]);
            if (userId != null)
            {
                User usr = db.Users.Where(u => u.userId == userId).FirstOrDefault();
                FName.Text = usr.firstName;
                LName.Text = usr.lastName;
                tbTitle.Text = usr.title;
                Email.Text = usr.email;
                Password.Text = usr.password;
                cbEnabled.Checked = usr.enabled;
                lstAccessLevels.SelectedValue = usr.role.ToString();

                //get group associations
                List<User_GroupsGet_Result> groups = db.User_GroupsGet(userId).ToList();
                List<int> groupIds = groups.Select(u => u.groupId).ToList();
                foreach (ListItem li in lstGroups.Items)
                {
                    if (groupIds.Contains(int.Parse(li.Value)))
                    {
                        li.Selected = true;
                    }
                }
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static string SaveUser(string fname, string lname, string title, string email, string password, bool enabled, int role, string groupIds)
        {
            string uid = Utilities.GetQueryString("uid");
            int ? userId = Utilities.TryToParseAsInt(uid);

            lms_Entities db = new ClientDBEntities();
            if (userId == null)
            {
                //this is a new user
                User newUser = new User
                {
                    firstName = fname,
                    lastName = lname,
                    title = title,
                    enabled = enabled,
                    email = email,
                    role = role,
                    password = password,
                    timestamp = DateTime.Now
                };
                db.Users.Add(newUser);
                db.SaveChanges();
                userId = newUser.userId;
            }
            else
            {
                //this is an update
                User usr = db.Users.Where(u => u.userId == userId).FirstOrDefault();
                usr.firstName = fname;
                usr.lastName = lname;
                usr.title = title;
                usr.email = email;
                usr.enabled = enabled;
                usr.role = role;
                usr.password = password;
                db.SaveChanges();
            }

            //save group assignments
            db.User_GroupsSet(userId, groupIds);

            return JsonResponse.NoError;
        }
    }
}