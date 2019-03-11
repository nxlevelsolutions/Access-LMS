using NXLevel.LMS.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.SessionState;

namespace NXLevel.LMS
{
    public enum Role : int
    {
        //NoAccess = 0,       //user has no access to anything at all
        Learner = 1,        //user is a basic user, i.e: only end user access.. no admin whatsoever
        Manager = 2,        //user can view team-only reports
        Administrator = 4,  //user can view all reports in allowed "domain"
        GlobalAdmin = 8,    //user can add/deactivate/reports/upload courses/create curriculum/assignments for allowed domain(s))
        SystemAdmin = 16    //RESERVED FOR NXLEVEL STAFF - does not have any restrictions whatsoever across any client databases
    };

    public class Roles
    {
        public static List<string> GetNames(int roles)
        {
            //returns list of ALL roles in a given Roles code (compound) number
            List<string> list = new List<string>();
            if ((int)Role.Learner == (roles & (int)Role.Learner)) list.Add(GetRoleName(Role.Learner));
            if ((int)Role.Manager == (roles & (int)Role.Manager)) list.Add(GetRoleName(Role.Manager));
            if ((int)Role.Administrator == (roles & (int)Role.Administrator)) list.Add(GetRoleName(Role.Administrator));
            if ((int)Role.GlobalAdmin == (roles & (int)Role.GlobalAdmin)) list.Add(GetRoleName(Role.GlobalAdmin));
            if ((int)Role.SystemAdmin == (roles & (int)Role.SystemAdmin)) list.Add(GetRoleName(Role.SystemAdmin));
            return list;
        }

        public static string GetRoleName(Role role)
        {
            //gets the proper role name given a particular role code
            //if (role == Role.NoAccess) return "None";
            if (role == Role.Learner) return "Learner";
            if (role == Role.Manager) return "Manager";
            if (role == Role.Administrator) return "Administrator";
            if (role == Role.GlobalAdmin) return "Global Administrator";
            if (role == Role.SystemAdmin)
            {
                return "System Administrator";
            }
            else
            {
                return "";
            }
        }

    }
}