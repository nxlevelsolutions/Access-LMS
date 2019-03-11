using NXLevel.LMS.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
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
            public string dBConnString;
            public string assetsFolder;
        }

        public static void SetInfo(int userId, string fname, string lname, int roles, string companyName, string assetsFolder)
        {
            UserInfo usr;
            object uObj = HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
            if (uObj == null)
            {
                usr = new UserInfo();
            }
            else
            {
                usr = (UserInfo)uObj;
            }

            usr.userId = userId;
            usr.fname = fname;
            usr.lname = lname;
            usr.companyName = companyName;
            usr.assetsFolder = assetsFolder;
            usr.roles = roles;
            HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = usr;
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
            //set
            //{
            //    UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
            //    usr.userId = value;
            //    HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = usr;
            //}
        }

        //public static int dbId
        //{
        //    get
        //    {
        //        object uiObj = HttpContext.Current?.Session[Global.USERINFO_SESSION_KEY];
        //        if (uiObj == null)
        //        {
        //            return 0;
        //        }
        //        else
        //        {
        //            UserInfo usr = (UserInfo)uiObj;
        //            return usr.dbId;
        //        }
        //    }
        //}

        public static string CompanyName
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.companyName;
            }
            //set
            //{
            //    UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
            //    usr.companyName = value;
            //    HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = usr;
            //}
        }

        public static string Firstname
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.fname;
            }
            //set
            //{
            //    UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
            //    usr.fname = value;
            //    HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = usr;
            //}
        }

        public static string Lastname
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.lname;
            }
            //set
            //{
            //    UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
            //    usr.lname = value;
            //    HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = usr;
            //}
        }

        public static bool HasRole(Role role)
        {
            //this method checks if the Role "role" is contained inside the
            //int "userRoles".. true if it does/false if it does not.
            //"userRoles" is the sum of all roles assigned to a person.
            UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
            return (int)role == (usr.roles & (int)role);   
        }

        public static int Roles
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.roles;
            }
            set
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                usr.roles = value;
                HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = usr;
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
                if (HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] == null)
                {
                    FormsAuthentication.SignOut();
                    //NOTE: the following can generate a "Object moved to here." message
                    HttpContext.Current.Response.Redirect("");
                    return "";
                }
                else
                {
                    UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                    return usr.dBConnString;
                }
            }
            set
            {
                UserInfo usr = new UserInfo();
                usr.dBConnString = value;
                HttpContext.Current.Session[Global.USERINFO_SESSION_KEY] = usr;
            }
        }

        public static string assetsFolder
        {
            get
            {
                UserInfo usr = (UserInfo)HttpContext.Current.Session[Global.USERINFO_SESSION_KEY];
                return usr.assetsFolder;
            }
        }
         
    }
}