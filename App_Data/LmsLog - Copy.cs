using System;
using System.IO;
using System.Text;
using System.Web;
using System.Web.Caching;
using System.Web.Configuration;

namespace nxlevel.lms
{
    public class LmsLog
    {
        #region Constants

        private const string LOG_OBJ_NAME_IN_CACHE = "UnwrittenLogEntries";
        private const string UI_OBJ_NAME_IN_SESSION = "Session_UserId";
        private const string LOG_FILE_PREFIX = "LOG_";

        #endregion

        public static CacheItemRemovedCallback onRemove;

        public static void Write(string logEntry, bool writeNow = false)
        {
            StringBuilder unwrittenLogEntries;

            string logEntryTimeStamp = string.Format("{0} ", DateTime.Now);
            string userId = string.Empty;
            HttpContext context = HttpContext.Current;

            if (context == null)
            {
                userId = "UID=(no context)";
            }
            else
            {
                try
                {
                    userId = "UID=" + context.Session["UserId"] + " ";
                }
                catch (Exception ex)
                {
                    userId = "UID=(no context):";
                }
            }

            // Don't cache anything, just perform the save.
            if (context == null || WebConfigurationManager.AppSettings["CachedLogfileTimeout"] == "0" || writeNow)
            {
                using (TextWriter logFile = File.AppendText(GetLogFilename()))
                {
                    logFile.WriteLine(logEntryTimeStamp + userId + logEntry);
                }
            }
            else
            {
                // Create cache
                int timeOut = Convert.ToInt32(WebConfigurationManager.AppSettings["CachedLogfileTimeout"]);

                if (context != null && context.Cache[LOG_OBJ_NAME_IN_CACHE] == null)
                {
                    onRemove = new CacheItemRemovedCallback(SaveCachedLogEntries);

                    // Create a log entry.
                    unwrittenLogEntries = new StringBuilder(logEntryTimeStamp + userId + logEntry);

                    // Add the entry to the cache.
                    context.Cache.Insert(LOG_OBJ_NAME_IN_CACHE, unwrittenLogEntries, null, Cache.NoAbsoluteExpiration, System.TimeSpan.FromSeconds(timeOut), CacheItemPriority.Default, onRemove);
                }
                else
                {
                    // Get the entry from cache and append new data to it.
                    unwrittenLogEntries = (StringBuilder)context.Cache[LOG_OBJ_NAME_IN_CACHE];
                    unwrittenLogEntries.Append(Environment.NewLine + logEntryTimeStamp + userId + logEntry);
                }
            }
        }

        public static void SaveCachedLogEntries(string key, object value, CacheItemRemovedReason reason)
        {
            StringBuilder logEntry = new StringBuilder();
            string logEntryTimeStamp = string.Format("{0}", DateTime.Now);

            if (key == LOG_OBJ_NAME_IN_CACHE)
            {
                using (TextWriter logfile = File.AppendText(GetLogFilename()))
                {
                    logEntry = (StringBuilder)value;
                    logEntry.AppendLine();
                    logfile.WriteLine(logEntry.ToString());
                }
            }
        }

        private static string GetLogFilename()
        {
            if (!Directory.Exists(HttpRuntime.AppDomainAppPath + WebConfigurationManager.AppSettings["LogFileDirectory"]))
            {
                Directory.CreateDirectory(HttpRuntime.AppDomainAppPath + WebConfigurationManager.AppSettings["LogFileDirectory"]);
            }

            return HttpRuntime.AppDomainAppPath + WebConfigurationManager.AppSettings["LogFileDirectory"] + "\\" + LOG_FILE_PREFIX + DateTime.Now.ToString("MM_dd_yy") + ".txt";
        }
    }
}