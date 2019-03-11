using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace NXLevel.LMS
{
    public class Global : System.Web.HttpApplication
    {
        public const string USERINFO_SESSION_KEY = "UserInfo";

        protected void Application_Start(object sender, EventArgs e)
        {

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            HttpException ErrorException = (HttpException)Server.GetLastError().GetBaseException();
            //Log.Error("Application error:" + err.Message + 
            //             "Source:" + err.Source +
            //             "Stack Trace:" + err.StackTrace, true);
            if (ErrorException.ErrorCode == 404)
            {
                return;
            }

            string errDescription = ErrorException.ToString().Replace("\r", "<br>");
            string innerException = "";
            string userInfo = "";
            string dbName = "";

            if (ErrorException.InnerException != null)
            {
                innerException = ErrorException.InnerException.ToString().Replace("\r", "<br>");
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
                            "<tr><td align=right valign=top><b>Source:</b></td><td>" + ErrorException.Source + "</td></tr>" +
                            "<tr><td align=right valign=top><b>Details:</b></td><td>" + ErrorException.Message + "</td></tr>" +
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
            if (Session[USERINFO_SESSION_KEY] == null)
            {
                Log.Info("A session has ended.");
            }
            else
            {
                Log.Info("User Id=" + LmsUser.UserId + "'s session has ended.");
            }
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