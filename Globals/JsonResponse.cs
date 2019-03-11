using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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
         
    }
}