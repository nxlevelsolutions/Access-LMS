using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Configuration;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS
{
    public class Utilities
    {
        public enum ModuleStatus
        {
            INACTIVE = 0,
            ACTIVE = 1,
            RETIRED = 2
        }
  
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

        /*
        public static void InitializeApplication(HttpContext context)
        {
            bool isAlreadyInitialized = false;
            object app_Lock = new object();

            if (isAlreadyInitialized)
            {
                return;
            }

            lock (app_Lock)
            {
                if (isAlreadyInitialized)
                {
                    return;
                }

                isAlreadyInitialized = true;

                string domain = HttpContext.Current.Request.ServerVariables["SERVER_NAME"].ToLower();

                // FIX disable AppDomain restart when deleting subdirectory.
                // This code will turn off monitoring from the root website directory.
                // Monitoring of Bin, App_Themes and other folders will still be operational, so updated DLLs will still auto deploy.
                PropertyInfo propInfo = typeof(HttpRuntime).GetProperty("FileChangesMonitor", BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Static);
                object obj = propInfo.GetValue(null, null);
                FieldInfo fieldInfo = obj.GetType().GetField("_dirMonSubdirs", BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.IgnoreCase);
                object monitor = fieldInfo.GetValue(obj);
                MethodInfo methodInfo = monitor.GetType().GetMethod("StopMonitoring", BindingFlags.Instance | BindingFlags.NonPublic);
                methodInfo.Invoke(monitor, new object[0]);

                Log.Info("Initializing " + domain, false);

                // Get access level list data from the database.            
                Hashtable accessLevelList = new Hashtable();
                lms_Entities db = new lms_Entities();
                List<User_Access> userAccess = db.User_Access.ToList<User_Access>();

                foreach (var accessLevel in userAccess)
                {
                    accessLevelList.Add(accessLevel.userAccessId, accessLevel.accessLevel);
                }

                // Save the access level list in global memory.
                HttpContext.Current.Application.Add("AccessLevels", accessLevelList);
            }           
        }
        */
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


    }
}