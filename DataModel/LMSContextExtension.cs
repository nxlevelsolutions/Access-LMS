using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Core.Objects;
using System.Linq;
using System.Web;

namespace NXLevel.LMS.DataModel
{
    public partial class lms_Entities : DbContext
    {
        //extension method to receive connection string
        public lms_Entities(object connStrObj)
            : base(GetConnectionString(connStrObj))
        {
            
        }
        private static string GetConnectionString(object obj)
        {
            string val = null;
            if (obj != null)
            {
                val = obj.ToString();
            }
            return val;
        }
    }

    //extension class to get connection string automatically
    public class ClientDBEntities: lms_Entities
    {
        public ClientDBEntities(): 
            base(LmsUser.DBConnString)
        {
        }
    }
}
