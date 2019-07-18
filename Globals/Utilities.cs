using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Net.Mail;
using System.IO;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Linq;
using System.Web.Configuration;
using NXLevel.LMS.DataModel;
using System.Text;

namespace NXLevel.LMS
{
    public class Utilities
    {
        public static string RandomAccessCode()
        {
            const int numLength = 6;
            string str = "";
            Random rnd = new Random(Environment.TickCount);       
            char p;

            for (int x = 0; x < numLength; x++)
            {
                // Randomize the type of this character.
                switch (rnd.Next(1, 3))
                {
                    case 1:
                        // Numeric character
                        do
                        {
                            p = Convert.ToChar(rnd.Next(48, 57 + 1));
                        } while (p.ToString() == "0");
                        str += p;
                        break;
                    case 2:
                        // Uppercase character
                        do
                        {
                            p = Convert.ToChar(rnd.Next(65, 90 + 1)); 
                        } while (p.ToString() == "0");
                        str += p;
                        break;
                    case 3:
                        // Lowercase character
                        do
                        {
                            p = Convert.ToChar(rnd.Next(97, 122 + 1));
                        } while (p.ToString() == "0");
                        str += p;
                        break;
                }
            }

            return str;
        }

        public static void SendEmail(string fromEmail, string toEmail, string subject, string body, bool skipLoggerOnException = false)
        {
            // Sends emails in html format.
            MailMessage mail = new MailMessage(fromEmail, toEmail, subject, body);
            mail.IsBodyHtml = true;

            try
            {
                if (HttpContext.Current.Request.Url.Port == 80 || HttpContext.Current.Request.Url.Port == 443)
                {
                    SmtpClient client = new SmtpClient();
                    client.Send(mail);
                }
            }
            catch (Exception ex)
            {
                Log.Info(ex.ToString());
                HttpContext.Current.Response.Write("The following exception occurred: " + ex.ToString());

                // Check the InnerException.
                while (ex.InnerException != null)
                {
                    HttpContext.Current.Response.Write("The following exception occurred in SendEmail(\"" + toEmail + "\"): " + ex.ToString());
                    if (!skipLoggerOnException) Log.Error(ex, true);
                }
            }
        }

        public static void SendEmail(string fromEmail, string toEmail, string ccEmail, string subject, string body)
        {
            MailMessage mail = new MailMessage(fromEmail, toEmail, subject, body);
            mail.CC.Add(new MailAddress(ccEmail.Trim()));
            mail.IsBodyHtml = true;

            try
            {
                if (!HttpContext.Current.Request.IsLocal)
                {
                    SmtpClient client = new SmtpClient();
                    client.Send(mail);
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex.ToString());
                HttpContext.Current.Response.Write("The following exception occurred: " + ex.ToString());

                //check the InnerException
                while (ex.InnerException != null)
                {
                    HttpContext.Current.Response.Write("--------------------------------<br />");
                    HttpContext.Current.Response.Write("The following InnerException reported: " + ex.InnerException.ToString() + "<br />");
                    ex = ex.InnerException;
                }
            }
        }

        public static void SendEmail(string toEmail, string subject, string body)
        {
            SendEmail(ConfigurationManager.AppSettings.Get("SystemEmail"), toEmail, subject, body);
        }

        public static string GetFileContents(string filename)
        {
            string str = "";
            try
            {
                filename = HttpContext.Current.Server.MapPath(filename);
                if (File.Exists(filename))
                {
                    str = File.ReadAllText(filename);
                }
            }
            catch (Exception ex)
            {
                HttpContext.Current.Response.Write(ex.ToString());
            }
            return str;
        }
         
        public static bool IsEmailValid(string email)
        {
            string emailExp = @"^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$";
            return Regex.IsMatch(email.Trim(), emailExp);
        }

        public static bool IsPasswordValid(string pwd)
        {
            //get at least 6 alphanumeric characters
            string req = @"^[A-Za-z0-9]{6,}$";
            return Regex.IsMatch(pwd, req);
        }

        public static void DownloadAsExcel(string filename, Control ctrl)
        {
            HttpResponse res = HttpContext.Current.Response;
            res.ClearContent();
            res.Buffer = true;
            res.AddHeader("content-disposition", "attachment;filename=" + filename + ".xls");
            res.Charset = "";
            res.ContentType = "application/vnd.ms-excel";

            StringWriter sw = new StringWriter();
            HtmlTextWriter hw = new HtmlTextWriter(sw);

            ctrl.RenderControl(hw);
            string rendered = sw.ToString();
            rendered = RemoveHtmlTag(rendered, "a");            //remove all "a" html tags
            rendered = RemoveHtmlAttribute(rendered, "class");  //remove all "class" attributes
            res.Write(rendered);
            res.Flush();
            res.End();
        }

        public static string RemoveHtmlTag(string source, string tag)
        {
            return Regex.Replace(source, @"<" + tag + "[^>]*>(.*?)</" + tag + ">", "$1");
        }

        public static string RemoveHtmlAttribute(string source, string attr)
        {
            return Regex.Replace(source, attr + @"=""[^\""]*""", "");
        }

        public static string ReplaceStringCaseInsensitive(string str, string oldValue, string newValue)
        {
            if (str == null) return str;

            StringBuilder sb = new StringBuilder();
            int previousIndex = 0;
            int index = str.IndexOf(oldValue, StringComparison.CurrentCultureIgnoreCase);
            while (index != -1)
            {
                sb.Append(str.Substring(previousIndex, index - previousIndex));
                sb.Append(newValue);
                index += oldValue.Length;

                previousIndex = index;
                index = str.IndexOf(oldValue, index, StringComparison.CurrentCultureIgnoreCase);
            }
            sb.Append(str.Substring(previousIndex));
            return sb.ToString();
        }

        public static string GetQueryString(string key)
        {
            //note: this function can be used when the Request object is not available (webmethod calls)
            //note: this is case-insensitive
            NameValueCollection qs = HttpUtility.ParseQueryString(HttpContext.Current.Request.UrlReferrer.Query);
            return qs[key];
        }

        public static string AddQueryString(string key, string value)
        {
            string ret = "";
            NameValueCollection qs = HttpUtility.ParseQueryString(HttpContext.Current.Request.UrlReferrer.Query);
            if (qs[key] == null)
            {
                qs.Add(key, value);
            }
            else
            {
                qs[key] = value;
            }
            
            foreach (string qkey in qs.AllKeys)
            {
                ret += qkey + "=" + qs[qkey] + "&";
            }

            return ret.Substring(0, ret.Length-1);
        }

        #region data type conversions
        public static int? TryToParseAsInt(string value)
        {
            int number;
            bool result = Int32.TryParse(value, out number);
            if (result)
            {
                return number;
            }
            else
            {
                return null;
            }
        }

        public static decimal? TryToParseAsDec(string value)
        {
            decimal number;
            bool result = decimal.TryParse(value, out number);
            if (result)
            {
                return number;
            }
            else
            {
                return null;
            }
        }
        public static double? TryToParseAsDouble(string value)
        {
            double number;
            bool result = double.TryParse(value, out number);
            if (result)
            {
                return number;
            }
            else
            {
                return null;
            }
        }
        public static DateTime? TryToParseAsDateTime(string value)
        {
            DateTime dt;
            bool result = DateTime.TryParse(value, out dt);
            if (result)
            {
                return dt;
            }
            else
            {
                return null;
            }
        }

        public static bool? TryToParseAsBool(string value)
        {
            bool dt;

            if (value == "1") return true;  //added
            if (value == "0") return false; //added

            bool result = bool.TryParse(value, out dt);
            if (result)
            {
                return dt;
            }
            else
            {
                return null;
            }
        }

        #endregion
    }
}