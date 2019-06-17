using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace NXLevel.LMS
{
    public class JsonResponse
    {

        public static string NoError
        {
            get
            {
                return Error("");
            }
        }

        public static string Error(string message)
        {
            return "{\"error\":\"" + message  + "\"}";
        }

        public static string Error(Exception exc)
        {
            return "{\"error\":\"" + exc.InnerException.Message + "\"}";
        }

        public static string Data(string errMessage, object obj)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            object resObj = new { error = errMessage, data = obj };
            return jsSerializer.Serialize(resObj);
        }

    }
}