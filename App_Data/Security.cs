using System;
using System.Web;

namespace NXLevel.LMS
{
    public class Security
    {
        #region Enums

        public enum Roles
        {
            ACC_USER = 1,       // End-user, bottom level
            ACC_DISTRICT = 2,   // District Manager access
            ACC_REGION = 3,     // Regional Manager access
            ACC_GLOBAL = 4,     // Administrator - global (all) report
            ACC_SYSTEM = 5      // Access to the system
        }

        #endregion

        public static bool HasAccess(int requestedAccessCode)
        {
            int userAccessLevel = Convert.ToInt32(HttpContext.Current.Session["AccessLevel"]);
            return requestedAccessCode <= userAccessLevel;
        }
    }
}