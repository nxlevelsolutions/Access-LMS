using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using NXLevel.LMS;
using NXLevel.LMS.DataModel;


namespace NXLevel.LMS.Admin
{
    /// <summary>
    /// Summary description for Event_Scanner
    /// </summary>
    public class Event_Scanner : IHttpHandler
    {

        lms_Entities db;
        HttpResponse res;
        HttpRequest req;

        public void ProcessRequest(HttpContext context)
        {
            Dictionary<string, string> emailKeys = new Dictionary<string, string>(); //NOTE: all available keys are in js/tinymce.plugin.js: line 20+
            res = context.Response;
            req = context.Request;
            res.ContentType = "text/plain";

            //scan through all client databases
            foreach (ClientSetting client in ClientSettings.Get())
            {
                LmsUser.DBConnString = client.EntityConnStr;    //set connection string
                db = new ClientDBEntities();       //open client db
                WriteMsg("Processing:" + client.Name);

                foreach (Assignment asg in db.Assignments)
                {
                    if (asg.enabled)
                    {

                        //get list of users in assignment
                        List<Assignment_UsersGet_Result> allUsers =  db.Assignment_UsersGet(asg.assignmentId).ToList();
                        List<int> userIds = allUsers.Where(u => u.IsInAssignment==true && u.enabled).Select(u => u.userId).ToList(); //get only enabled  users... don't email disabled people


                        //get list of courses in assignment
                        List<Assignment_CoursesGet_Result> allCourses = db.Assignment_CoursesGet(asg.assignmentId).ToList();
                        List<int> courseIds = allCourses.Where(c => c.IsInAssignment == true && c.enabled).Select(c => c.courseId).ToList(); //get enabled courses
                        string courseTitles = string.Join(",", allCourses.Where(c => c.IsInAssignment == true && c.enabled).Select(c => c.title).ToList()); //get enabled courses


                        //add extra keys
                        emailKeys.Add("{CoursesAssigned}", courseTitles);
                        emailKeys.Add("{LMSUrl}", req.Url.Scheme + "://" + req.Url.Host);
                        emailKeys.Add("{DueDate}", "");


                        //handle emails that are supposed to be sent when the activity is assigned to user
                        if (asg.sendEmailOnAssigned)
                        {
                            //send email to each person
                            //SendEmails(asg.assignmentId, EmailTemplate.ASSIGNED_ACTIVITY, userIds, emailKeys);
                        }

                        //handle emails that are sent periodically every X days
                        if (asg.sendEmailPeriodic && asg?.periodicDays > 0)
                        {
                            if (asg.periodicEmailSent==null || 
                                (((DateTime) asg.periodicEmailSent).AddDays((double)asg.periodicDays).Subtract(DateTime.Now).TotalDays == 0 &&
                                 ((DateTime) asg.periodicEmailSent).Subtract(DateTime.Now).TotalDays != 0) //only once a day
                               )
                            {
                                SendEmails(asg.assignmentId, EmailTemplate.PERIODIC_REMINDER, userIds, emailKeys);

                                //set today's date
                                asg.periodicEmailSent = DateTime.Now;
                                db.SaveChanges();
                            }
                        }

                        //handle "due date"-related options
                        if (asg.dueDate != null)
                        {

                            emailKeys["{DueDate}"] = asg.dueDate.ToString(); //reset 

                            //handle emails that are sent "near" due data as last reminder to users
                            if (asg.sendEmailNearDueDate && asg.nearDueDateDays > 0)
                            {
                                if ( asg.nearDueDateEmailSent == null ||
                                    (((DateTime)asg.dueDate).Subtract(DateTime.Now).TotalDays == asg.nearDueDateDays &&
                                     ((DateTime)asg.nearDueDateEmailSent).Subtract(DateTime.Now).TotalDays != 0) //only once a day
                                   )
                                {
                                    //it's today, send it
                                    SendEmails(asg.assignmentId, EmailTemplate.NEAR_DUE_DATE_REMINDER, userIds, emailKeys);

                                    //set today's date
                                    asg.nearDueDateEmailSent = DateTime.Now;
                                    db.SaveChanges();
                                }
                            }

                            //handle emails on the date that activity is due
                            if (asg.sendEmailOnDueDate)
                            {
                                if (asg.dueEmailSent==null ||
                                    (((DateTime)asg.dueDate).Subtract(DateTime.Now).TotalDays == 0 &&
                                    ((DateTime)asg.dueEmailSent).Subtract(DateTime.Now).TotalDays != 0)
                                    )
                                {
                                    //today is due date
                                    SendEmails(asg.assignmentId, EmailTemplate.ON_DUE_DATE_REMINDER, userIds, emailKeys);

                                    //set today's date
                                    asg.dueEmailSent = DateTime.Now;
                                    db.SaveChanges();
                                }
                            }

                            //handle emails on activities that are over due
                            if (asg.sendEmailOverdue)
                            {
                                if (asg.sendOverdueEmailSent==null ||
                                    (((DateTime)asg.dueDate).Subtract(DateTime.Now).TotalDays < 0 &&
                                    ((DateTime)asg.sendOverdueEmailSent).Subtract(DateTime.Now).TotalDays != 0)
                                    )
                                {
                                    //today is past due date
                                    SendEmails(asg.assignmentId, EmailTemplate.ON_DUE_DATE_REMINDER, userIds, emailKeys);

                                    //set today's date
                                    asg.sendOverdueEmailSent = DateTime.Now;
                                    db.SaveChanges();
                                }
                            }
                        }

                    }
                }

            }
            
        }

        private void SendEmails(int assignmentId, EmailTemplate emailId, List<int> allUserIds, Dictionary<string, string> customKeys)
        {
            Email template = db.Emails.FirstOrDefault(e => e.emailId == (int)emailId);
            foreach (int userId in allUserIds)
            {
                User userInfo = db.Users.FirstOrDefault(u => u.userId == userId);
                string userEmail = userInfo.email;
                string body = template.body;
                string subject = template.subject;

                //add last 2 keys 
                customKeys.Add("{FirstName}", userInfo.firstName);
                customKeys.Add("{LastName}", userInfo.lastName);

                foreach (KeyValuePair<string, string> code in customKeys)
                {
                    body = Utilities.ReplaceStringCaseInsensitive(body, code.Key, code.Value);
                    subject = Utilities.ReplaceStringCaseInsensitive(subject, code.Key, code.Value);
                }

                body = "<span style=\"font-family: Arial, Verdana, sans-serif;font-size: 10pt;\">" + body + "</span>";
                WriteMsg("Sending to='" + userEmail + "'");
                if (req.Url.Port == 80 || req.Url.Port == 443)
                {
                    //visual studio uses random port #s in development boxes
                    Log.Info("Email " + emailId + " to:" + userEmail);
                    Utilities.SendEmail(userEmail, subject, body);
                    //bool entryAdded = (bool) db.User_Email(assignmentId, userId, (int)emailId).FirstOrDefault();
                }
            }
        }

        private void WriteMsg(string msg)
        {
            res.Write(DateTime.Now + ") " + msg + "\r");
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}