using System;
using System.Configuration;
using System.IO;
using System.Diagnostics;
using System.Text;
using System.Web;
using System.Web.Caching;
using System.Web.Configuration;

namespace NXLevel.LMS
{
    public class Log
    {
        public const string DELIMITER = ";";

        public static void Error(string message, bool notifyViaEmail = false)
        {
            Trace.WriteLine(TraceEventType.Error + DELIMITER + message);
            if (notifyViaEmail) Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), ConfigurationManager.AppSettings.Get("SystemEmail"), "Intela logged ERROR", message, true);
        }

        public static void Error(Exception ex, bool notifyViaEmail = false)
        {
            Trace.WriteLine(TraceEventType.Error + DELIMITER + ex.Message + "\r\n" + ex.StackTrace);
            if (notifyViaEmail) Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), ConfigurationManager.AppSettings.Get("SystemEmail"), "Intela logged ERROR", ex.Message + "\r\n" + ex.StackTrace, true);
        }

        public static void Warning(string message, bool notifyViaEmail = false)
        {
            Trace.WriteLine(TraceEventType.Warning + DELIMITER + message);
            if (notifyViaEmail) Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), ConfigurationManager.AppSettings.Get("SystemEmail"), "Intela logged WARNING", message, true);
        }

        public static void Info(string message, bool notifyViaEmail = false)
        {
            Trace.WriteLine(TraceEventType.Information + DELIMITER + message);
            if (notifyViaEmail) Utilities.SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), ConfigurationManager.AppSettings.Get("SystemEmail"), "Intela logged INFO", message, true);
        }
    }
}