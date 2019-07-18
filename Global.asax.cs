using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using System.Threading;
using System.Globalization;

namespace NXLevel.LMS
{
    //note: the codes below MUST match the emailId
    //of each email template in table "Emails"
    public enum EmailTemplate
    {
        ASSIGNED_ACTIVITY = 1,
        PERIODIC_REMINDER = 2,
        NEAR_DUE_DATE_REMINDER = 3,
        ON_DUE_DATE_REMINDER = 4,
        OVERDUE_REMINDER = 5
    }

    public enum CourseType
    {
        SCORM = 1,
        AICC = 2,
        READ_AND_SIGN = 3
    }

    public enum AssignmentType
    {
        SINGLE_COURSE = 1,
        LEARNING_PLAN = 2
    }

    //data returned by [dbo].[User_UsageHistory] can be 1 of these types:
    public enum UsageEventType
    {
        SCORE = 1,
        STARTED = 2,
        COMPLETED = 3
    }

    public class Global : System.Web.HttpApplication
    {
        public const string USERINFO_SESSION_KEY = "UserInfo";
        public const string WEBSITE_COURSES_FOLDER = "courses";
        public const string LANGUAGE_COOKIE = "LANG";

        protected void Application_Start(object sender, EventArgs e)
        {

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            string langCode;
            if (HttpContext.Current.Request.Cookies[Global.LANGUAGE_COOKIE] == null || HttpContext.Current.Request.Cookies[Global.LANGUAGE_COOKIE].Value == "")
            {
                langCode = "en-US"; //default to english
            }
            else
            {
                langCode = HttpContext.Current.Request.Cookies[Global.LANGUAGE_COOKIE].Value;
            }
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(langCode);
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(langCode);
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            
        }

        protected void Application_Error(object sender, EventArgs e)
        {

            Exception ex = Server.GetLastError().GetBaseException();

            //HttpException ErrorException = (HttpException)Server.GetLastError().GetBaseException();

            if (ex is HttpException && ((HttpException)ex).ErrorCode == 404)
            {
                return;
            }

            Log.Error(ex);

            string errDescription = ex.ToString().Replace("\r", "<br>");
            string innerException = "";
            string userInfo = "";
            string dbName = "";

            if (ex.InnerException != null)
            {
                innerException = ex.InnerException.ToString().Replace("\r", "<br>");
            }

            //user info
            try
            {
                userInfo = "<p>CompanyName=" + LmsUser.CompanyName + ", First name=" + LmsUser.Firstname + ", Last name=" + LmsUser.Lastname + "</p>";
            }
            catch (Exception)
            {
                userInfo = "N/A";
            }

 
            //error info
            string str = "<style type='text/css'>p,td{font-size:10pt; font-family:arial;}</style>" +
                        "<div style='background-color:#eb9316;color:white;'>LMS Site Un-Trapped Error - " + Server.MachineName + "</div>" +
                        "<table border=0 cellpadding=5 cellspacing=0>" +
                            "<tr><td align=right valign=top><b>URL:</b></td><td>" + Request.Url.ToString() + "</td></tr>" +
                            "<tr><td align=right valign=top><b>Message:</b></td><td>" + errDescription + "</td></tr>" +
                            "<tr><td align=right valign=top><b>Source:</b></td><td>" + ex.Source + "</td></tr>" +
                            "<tr><td align=right valign=top><b>Details:</b></td><td>" + ex.Message + "</td></tr>" +
                            "<tr><td align=right valign=top><b>Inner Exception:</b></td><td>" + innerException + "</td></tr>" +
                            "<tr><td align=right valign=top nowrap><b>Date:</b></td><td>" + DateTime.Now.ToShortTimeString() + "</td></tr>" +
                            "<tr><td align=right valign=top nowrap><b>Remote IP:</b></td><td>" + Request.ServerVariables["REMOTE_ADDR"] + "</td></tr>" +
                            "<tr><td align=right valign=top nowrap><b>All Server Vars:</b></td><td>" + Request.ServerVariables["ALL_HTTP"].Replace("\r", "<br>") + "</td></tr>" +
                            "<tr><td align=right valign=top><b>Logged user:</b></td><td>" + userInfo + "</td></tr>" +
                          "</table>";

            if (ConfigurationManager.AppSettings.Get("SendEmailOnApplicationError") == "1")
            {
                Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), "LMS Trapped Error - From " + Server.MachineName + " db=" + dbName, "<html><body>" + str + "</body></html>");
            }
        }

        protected void Session_End(object sender, EventArgs e)
        {
            Log.Info("SessionID " + Session.SessionID + " ended.");
        }

        protected void Application_End(object sender, EventArgs e)
        {
            // Get all the log entries and force a write immediately. 
            StringBuilder logEntries = new StringBuilder();
            logEntries.Append("LMS application module shut down/restart." + Environment.NewLine);

            HttpRuntime runtime = null;
            Type t = typeof(HttpRuntime);
            runtime = (HttpRuntime)t.InvokeMember("_theRuntime", BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.GetField, null, null, null);
            if (runtime == null)
            {
                Log.Info(logEntries.ToString());
                return;
            }

            //get reason for shutdown
            string shutDownMessage = (string)runtime.GetType().InvokeMember("_shutDownMessage", BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.GetField, null, runtime, null);
            string shutDownStack = (string)runtime.GetType().InvokeMember("_shutDownStack", BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.GetField, null, runtime, null);
            logEntries.Append("Shutdown Message=" + shutDownMessage + Environment.NewLine);
            logEntries.Append("Shutdown Stack=" + shutDownStack + Environment.NewLine);

            Log.Info(logEntries.ToString());
        }
    }
}