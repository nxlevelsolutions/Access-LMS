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

        protected void Application_Start(object sender, EventArgs e)
        {

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            //HttpApplication app = (HttpApplication)sender;
            //HttpContext context = app.Context;

            //// Perform first request initialization.
            //Utilities.InitializeApplication(context);
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
            
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            Exception err = Server.GetLastError().GetBaseException();
            LmsLog.Error("Application error:" + err.Message, true);
            LmsLog.Error("Source:" + err.Source, true);
            LmsLog.Error("Stack Trace:" + err.StackTrace, true);
        }

        protected void Session_End(object sender, EventArgs e)
        {
            if ( Session["userId"] == null)
            {
                LmsLog.Info("A session has ended.", true);
            }
            else
            {
                LmsLog.Info("User Id=" + Session["userId"] + "'s session has ended.");
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
                LmsLog.Info(logEntries.ToString());
                return;
            }

            //get reason for shutdown
            string shutDownMessage = (string)runtime.GetType().InvokeMember("_shutDownMessage", BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.GetField, null, runtime, null);
            string shutDownStack = (string)runtime.GetType().InvokeMember("_shutDownStack", BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.GetField, null, runtime, null);
            logEntries.Append("Shutdown Message=" + shutDownMessage + Environment.NewLine);
            logEntries.Append("Shutdown Stack=" + shutDownStack + Environment.NewLine);

            LmsLog.Info(logEntries.ToString());
        }
    }
}