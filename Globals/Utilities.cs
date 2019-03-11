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

    public enum ModuleStatus
    {
        INACTIVE = 0,
        ACTIVE = 1,
        RETIRED = 2
    }

    public enum AssignmentType
    {
        SINGLE_COURSE = 1,
        LEARNING_PLAN = 2
    }

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

        //public static string SetQueryString(HttpRequest request, string key, string value)
        //{
        //    NameValueCollection queryCollection = new NameValueCollection(request.QueryString); 
        //    string newQueryStr = string.Empty;

        //    if (value == null)
        //    {
        //        queryCollection.Remove(key);
        //    }
        //    else
        //    {
        //        queryCollection.Set(key, value);
        //    }

        //    for (int i = 0; i < queryCollection.Count; i++)
        //    {
        //        newQueryStr += queryCollection.Keys[i] + "=" + queryCollection.Keys[i] + "&";
        //    }

        //    if (queryCollection.Count == 0)
        //    {
        //        return request.Path;
        //    }
        //    else
        //    {
        //        return request.Path + "?" + newQueryStr.Substring(0, newQueryStr.Length - 1);
        //    }
        //}

        //public static string SetQueryString(string requestUrl, string key, string value)
        //{
        //    // This function takes a url, with or without querystrings 
        //    // and sets the key to the value string.
        //    int keyStart = requestUrl.IndexOf(key);

        //    if (keyStart > 0) // It's in the string.
        //    {
        //        // Delete the key and value.
        //        int valEnd = requestUrl.IndexOf("&", keyStart);
        //        if (valEnd == -1) // Not found, this key is the last one.
        //        {
        //            requestUrl = requestUrl.Substring(0, keyStart - 1); // Delete it.
        //        }
        //        else
        //        {
        //            string segment = requestUrl.Substring(keyStart, valEnd - keyStart); // Get it.
        //            requestUrl = requestUrl.Replace(segment, ""); // Delete it.
        //        }
        //    }

        //    int separatorIndex = requestUrl.IndexOf("?");
        //    if (value == null) // Don't add the key.
        //    {
        //        return requestUrl;
        //    }
        //    else // Add key and value.
        //    {
        //        if (separatorIndex > 0)
        //        {
        //            return requestUrl + "&" + key + "=" + value;
        //        }
        //        else
        //        {
        //            return requestUrl + "?" + key + "=" + value;
        //        }
        //    }
        //}

        public static void SendEmail(string fromEmail, string toEmail, string subject, string body, bool skipLoggerOnException = false)
        {
            // Sends emails in html format.
            MailMessage mail = new MailMessage(fromEmail, toEmail, subject, body);
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
            HttpResponse response = HttpContext.Current.Response;

            response.ClearContent();
            response.Buffer = true;
            response.AddHeader("content-disposition", "attachment;filename=" + filename + ".xls");
            response.Charset = "";
            response.ContentType = "application/vnd.ms-excel";

            StringWriter sw = new StringWriter();
            HtmlTextWriter hw = new HtmlTextWriter(sw);

            ctrl.RenderControl(hw);
            string rendered = sw.ToString();
            rendered = RemoveHtmlTag(rendered, "a");            //remove all "a" html tags
            rendered = RemoveHtmlAttribute(rendered, "class");  //remove all "class" attributes
            response.Write(rendered); 
            response.Flush();
            response.End();
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

        public static string getQueryString(string key)
        {
            //note: this function can be used whent the Request object is not available (webmethod calls)
            //note: this is case-insensitive
            NameValueCollection qs = HttpUtility.ParseQueryString(HttpContext.Current.Request.UrlReferrer.Query);
            return qs[key];
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

        #endregion
    }
}