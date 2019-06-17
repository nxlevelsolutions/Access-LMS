using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace NXLevel.LMS
{
    public class DailyLogTraceListener : TraceListener
    {
        private string _logFolder = "";
        private DateTime _currentDate;
        private StreamWriter _traceWriter;

        public DailyLogTraceListener(string subfolder)
        {
            _logFolder = subfolder;
            _traceWriter = new StreamWriter(GenerateFileName(), true);
        }

        public override void Write(string message)
        {
            CheckRollover();
            _traceWriter.Write(message);
        }

        public override void Write(string message, string category)
        {
            CheckRollover();
            _traceWriter.Write(category + Log.DELIMITER + message);
        }


        public override void WriteLine(string message)
        {
            CheckRollover();
            StringBuilder sb = new StringBuilder();
            sb.Append(DateTime.Now.ToString("hh:mm:sstt"));
            sb.Append(Log.DELIMITER); 
            sb.Append(LmsUser.UserId);
            sb.Append(Log.DELIMITER);
            sb.Append(message);
            _traceWriter.WriteLine(sb.ToString());
        }

        public override void WriteLine(string message, string category)
        {
            CheckRollover();
            StringBuilder sb = new StringBuilder();
            sb.Append(DateTime.Now.ToString("HH:mm:ss tt"));
            sb.Append(Log.DELIMITER);
            sb.Append(LmsUser.UserId);
            sb.Append(Log.DELIMITER);
            sb.Append(message);
            sb.Append(Log.DELIMITER);
            sb.Append(category);
            _traceWriter.WriteLine(sb.ToString());
        }

        private string GenerateFileName()
        {
            _currentDate = DateTime.Today;
            string append = Debugger.IsAttached ? "_debug" : "";
            return Path.Combine(HttpRuntime.AppDomainAppPath + _logFolder, _currentDate.ToString("yyyy-MM-dd") + append + ".txt");
        }

        private void CheckRollover()
        {
            if (_currentDate.CompareTo(DateTime.Today) != 0)
            {
                _traceWriter.Close();
                _traceWriter = new StreamWriter(GenerateFileName(), true);
            }
        }

        public override void Flush()
        {
            lock (this)
            {
                if (_traceWriter != null)
                {
                    _traceWriter.Flush();
                }
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _traceWriter.Close();
            }
        }
    }
}