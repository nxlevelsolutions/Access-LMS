using NXLevel.LMS.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace NXLevel.LMS
{
    public class LmsUser
    {
        private struct UserInfo
        {
            public int userId;
            public int roles;
            public string fname;
            public string lname;
            public string companyName;
            public string dbConnString;
            public int dbId;
            public UserInfo(int userId, int roles, string fname, string lname, string companyName, string dbConnString, int dbId)
            {
                this.userId = userId;
                this.roles = roles;
                this.fname = fname;
                this.lname = lname;
                this.companyName = companyName;
                this.dbConnString = dbConnString;
                this.dbId = dbId;
            }
        }

        public static int UserId
        {
            get
            {
                object uiObj = HttpContext.Current?.Session[Global.USERINFO_SESSION_KEY];
                if (uiObj == null)
                {
                    return 0;
                }
                else
                {
                    UserInfo usr = (UserInfo)uiObj;
                    return usr.userId;
                }
            }
        }

        public static int dbId
        {
            get
            {
                object uiObj = HttpContext.Current?.Session[Global.USERINFO_SESSION_KEY];
                if (uiObj == null)
                {
                    return 0;
                }
                else
                {
                    UserInfo usr = (UserInfo)uiObj;
                    return usr.dbId;
                }
            }
        }

        public static string CompanyName
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.companyName;
            }
        }

        public static string Firstname
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.fname;
            }
        }

        public static string Lastname
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.lname;
            }
        }

        public static int Roles
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.roles;
            }
            //set
            //{
            //    //update current session
            //    UserInfo usr = (UserInfo)HttpContext.Current.Session["UserInfo"];
            //    usr.roles = value;

            //    //update database
            //    intelaEntities dbClient = new ClientDBEntities();
            //    dbClient.Admin_UserRoleSet(AdminUser.UserId, value);
            //}
        }

        public static string DBConnString
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.dbConnString;
                //if (HttpContext.Current.Session["UserInfo"] == null)
                //{
                //    return "";
                //}
                //else
                //{
                //    UserInfo usr = (UserInfo)HttpContext.Current.Session["UserInfo"];
                //    return usr.dbConnString;
                //}
            }
        }

        public static void SetInfo(int userId, int roles, string fname, string lname, string companyName, string dbConnString, int dbId)
        {
            HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = new UserInfo(userId, roles, fname, lname, companyName, dbConnString, dbId);
        }

         

     

    }
}