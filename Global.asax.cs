using System;
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
            Exception err = Server.GetLastError().GetBaseException();
            Log.Error("Application error:" + err.Message + 
                         "Source:" + err.Source +
                         "Stack Trace:" + err.StackTrace, true);
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