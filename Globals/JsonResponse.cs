using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

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
            return "{\"error\":" + JsonConvert.ToString(message)  + "}";
        }

        public static string Error(Exception exc)
        {
            return "{\"error\":" + JsonConvert.ToString(exc.InnerException.Message) + "}";
        }

        public static string Data(string errMessage, object obj)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            object resObj = new { error = errMessage, data = obj };
            return jsSerializer.Serialize(resObj);
        }

    }
}