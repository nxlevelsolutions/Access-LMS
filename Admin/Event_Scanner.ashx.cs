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
            //NOTE: all available keys are in js/tinymce.plugin.js: line 20+ and implemented here
            Dictionary<string, string> emailKeys = new Dictionary<string, string>(); 
            res = context.Response;
            req = context.Request;
            res.ContentType = "text/plain";
            int count;

            //scan through all client databases
            foreach (ClientSetting client in ClientSettings.Get())
            {
                if (client.Enabled) //scan only enabled clients
                {
                    db = new ClientDBEntities(client.EntityConnStr);       //open client db
                    WriteMsg("Processing:\"" + client.Name + "\"");
                    IList<Assignment> assignments = db.Assignments.ToList();

                    foreach (Assignment asg in assignments)
                    {
                        WriteMsg("Assignment id="+ asg.assignmentId + "=" + asg.title);

                        if (asg.enabled) //scan only enabled assignments
                        {

                            //get list of users in assignment
                            List<Assignment_UsersGet_Result> allUsers = db.Assignment_UsersGet(asg.assignmentId, false).ToList();
                            List<int> userIds = allUsers.Where(u => u.enabled==true).Select(u => u.userId).ToList(); //get only enabled  users... don't email disabled people


                            //get list of courses in assignment
                            List<Assignment_CoursesGet_Result> allCourses = db.Assignment_CoursesGet(asg.assignmentId).ToList();
                            List<int> courseIds = allCourses.Where(c => c.IsInAssignment == true && c.enabled).Select(c => c.courseId).ToList(); //get enabled courses
                            string courseTitles = string.Join(", ", allCourses.Where(c => c.IsInAssignment == true && c.enabled).Select(c => c.title).ToList()); //get enabled courses


                            //add keys
                            emailKeys.Add("{CoursesAssigned}", courseTitles);
                            emailKeys.Add("{LMSUrl}", req.Url.Scheme + "://" + req.Url.Host);
                            emailKeys.Add("{DueDate}", "");
                            emailKeys.Add("{FrequencyOfPeriodicReminders}", asg?.periodicDays.ToString());
                            //emailKeys.Add("{ActivityTitle}", asg.title);

                            #region Handle emails sent on assignment
                            //==================================================
                            // handle emails that are supposed to be sent when 
                            // the activity is assigned to user
                            //==================================================
                            if (asg.sendEmailOnAssigned)
                            {
                                //get list of new people NOT sent the "assigned activity" email
                                List<int?> list = db.Users_EmailsNotSent(
                                    string.Join(",", userIds), 
                                    asg.assignmentId, 
                                    (int)EmailTemplate.ASSIGNED_ACTIVITY
                                    ).ToList();

                                List<int> UnEmailedUsers = new List<int>(list.Cast<int>());

                                SendEmails(EmailTemplate.ASSIGNED_ACTIVITY, UnEmailedUsers, emailKeys, courseIds, asg.assignmentId);

                                count = (int)db.Users_Email_Add(string.Join(",", UnEmailedUsers), asg.assignmentId, (int)EmailTemplate.ASSIGNED_ACTIVITY).FirstOrDefault();
                            }
                            #endregion

                            #region Handle periodic emails
                            //==================================================
                            // handle emails sent periodically every X days
                            //==================================================
                            if (asg.sendEmailPeriodic && asg.periodicDays > 0)
                            {
                                if (asg.periodicEmailSent == null ||
                                    (((DateTime)asg.periodicEmailSent).AddDays((double)asg.periodicDays).Subtract(DateTime.Today).Days < 1) //0=today; < -1=in the past
                                   )
                                {
                                    SendEmails(EmailTemplate.PERIODIC_REMINDER, userIds, emailKeys, courseIds, asg.assignmentId);

                                    //set today's date in assig table. Not recorded in users
                                    asg.periodicEmailSent = DateTime.Today;
                                }
                            }
                            #endregion

                            #region Handle emails when a specific due date was specified in assignment
                            //==================================================
                            // check if there's a due date to take into account
                            //==================================================
                            if (asg.dueDate != null)
                            {

                                emailKeys["{DueDate}"] = asg.dueDate.Value.ToShortDateString(); //reset 

                                //---------------------------------------------------------------------
                                //handle emails that are sent "near" due date - sent only ONCE
                                if (asg.sendEmailNearDueDate && asg.nearDueDateDays > 0)
                                {
                                    if (asg.nearDueDateEmailSent == null &&
                                        ((DateTime)asg.dueDate).Subtract(DateTime.Today).Days == asg.nearDueDateDays
                                       )
                                    {
                                        //it's today, send it
                                        SendEmails(EmailTemplate.NEAR_DUE_DATE_REMINDER, userIds, emailKeys, courseIds, asg.assignmentId);

                                        //set today's date
                                        asg.nearDueDateEmailSent = DateTime.Today;
                                    }
                                }

                                //---------------------------------------------------------------------
                                //handle emails on the date that activity is due - sent only ONCE
                                if (asg.sendEmailOnDueDate)
                                {
                                    if (asg.dueEmailSent == null &&
                                        ((DateTime)asg.dueDate).Subtract(DateTime.Today).Days == 0
                                        )
                                    {
                                        //today is due date
                                        SendEmails(EmailTemplate.ON_DUE_DATE_REMINDER, userIds, emailKeys, courseIds, asg.assignmentId);

                                        //set today's date
                                        asg.dueEmailSent = DateTime.Today;
                                    }
                                }

                                //---------------------------------------------------------------------
                                //handle emails on activities that are over due - sent only ONCE
                                if (asg.sendEmailOverdue)
                                {
                                    if (asg.sendOverdueEmailSent == null &&
                                        ((DateTime)asg.dueDate).Subtract(DateTime.Today).Days < 0
                                        )
                                    {
                                        //today is past due date
                                        SendEmails(EmailTemplate.OVERDUE_REMINDER, userIds, emailKeys, courseIds, asg.assignmentId);

                                        //set today's date
                                        asg.sendOverdueEmailSent = DateTime.Today;

                                    }
                                }
                            }
                            #endregion

                            #region Handle emails when due date is relative to assignment
                            //==================================================
                            // check if assignment has due date RELATIVE to assignment
                            //==================================================
                            if (asg.dueDaysAfterAssigned > 0)
                            {


                                foreach (int userId in userIds)
                                {
                                    // scan ASSIGNED_ACTIVITY
                                    count = (int)db.Users_Email_Add(userId.ToString(), asg.assignmentId, (int)EmailTemplate.ASSIGNED_ACTIVITY).FirstOrDefault();
                                    if (count == 1)
                                    {
                                        SendEmails(EmailTemplate.ASSIGNED_ACTIVITY, new List<int> { userId }, emailKeys, courseIds, asg.assignmentId);
                                    }

                                    //get person's assigned date
                                    List<User_EmailsSent_Result> emailsSent = db.User_EmailsSent(userId, asg.assignmentId).ToList();
                                    User_EmailsSent_Result email = emailsSent.Where(e => e.emailId == (int)EmailTemplate.ASSIGNED_ACTIVITY).FirstOrDefault();
                                    DateTime assignedDate = email.timestamp; //date when user was sent 

                                    //due date for this particular person
                                    emailKeys["{DueDate}"] = assignedDate.AddDays((double)asg.dueDaysAfterAssigned).ToShortDateString();

                                    // scan NEAR_DUE_DATE_REMINDER
                                    email = emailsSent.Where(e => e.emailId == (int)EmailTemplate.NEAR_DUE_DATE_REMINDER).FirstOrDefault();
                                    if (email == null && assignedDate.AddDays((double)(asg.dueDaysAfterAssigned - asg.nearDueDateDays)).Subtract(DateTime.Today).Days < 1) //it's 0 ON the day.... past is < zero
                                    {
                                        count = (int)db.Users_Email_Add(userId.ToString(), asg.assignmentId, (int)EmailTemplate.NEAR_DUE_DATE_REMINDER).FirstOrDefault();
                                        if (count == 1)
                                        {
                                            SendEmails(EmailTemplate.NEAR_DUE_DATE_REMINDER, new List<int> { userId }, emailKeys, courseIds, asg.assignmentId);
                                        }
                                    }

                                    // scan ON_DUE_DATE_REMINDER
                                    email = emailsSent.Where(e => e.emailId == (int)EmailTemplate.ON_DUE_DATE_REMINDER).FirstOrDefault();
                                    if (email == null && assignedDate.AddDays((double)asg.dueDaysAfterAssigned).Subtract(DateTime.Today).Days == 0) //today is due date
                                    {
                                        count = (int)db.Users_Email_Add(userId.ToString(), asg.assignmentId, (int)EmailTemplate.ON_DUE_DATE_REMINDER).FirstOrDefault();
                                        if (count == 1)
                                        {
                                            SendEmails(EmailTemplate.ON_DUE_DATE_REMINDER, new List<int> { userId }, emailKeys, courseIds, asg.assignmentId);
                                        }
                                    }

                                    //scan OVERDUE_REMINDER
                                    email = emailsSent.Where(e => e.emailId == (int)EmailTemplate.OVERDUE_REMINDER).FirstOrDefault();
                                    if (email == null && assignedDate.AddDays((double)asg.dueDaysAfterAssigned).AddDays((double)asg.overdueDays).Subtract(DateTime.Today).Days == 0) //next day of 
                                    {
                                        count = (int)db.Users_Email_Add(userId.ToString(), asg.assignmentId, (int)EmailTemplate.OVERDUE_REMINDER).FirstOrDefault();
                                        if (count == 1)
                                        {
                                            SendEmails(EmailTemplate.OVERDUE_REMINDER, new List<int> { userId }, emailKeys, courseIds, asg.assignmentId);
                                        }
                                    }

                                }
                            }
                            #endregion

                            emailKeys.Clear(); //clear for next assignment sweep
                        }
                        else
                        {
                            //assignment disabled
                            WriteMsg("Assignment disabled");
                        }
                    }
                    //done with db .. save if needed
                    db.SaveChanges();

                    WriteMsg("Scanner completed");
                }
                else
                {
                    WriteMsg("Scanner processing:\"" + client.Name + "\" skipped (disabled).");
                }

            }


        }

        private void SendEmails(EmailTemplate emailId, List<int> allUserIds, Dictionary<string, string> customKeys, List<int> coursesInAssignment, int assignmentId)
        {
            Email template = db.Emails.FirstOrDefault(e => e.emailId == (int)emailId);
            foreach (int userId in allUserIds)
            {

                //if user has completed this assigned activity then skip
                List<int?> coursesCompleted = db.Assignment_CoursesCompletedGet(assignmentId, userId).ToList();
                IEnumerable<int?> coursesIncomplete = coursesInAssignment.Cast<int?>().Except(coursesCompleted);
                if (coursesIncomplete.Count() == 0)
                {
                    continue;
                }

                //this user has not completed the assigned set... spam him/her
                User userInfo = db.Users.FirstOrDefault(u => u.userId == userId);
                string userEmail = userInfo.email;
                string body = template.body;
                string subject = template.subject;
                //string password = dbMain.Admin_UserPasswordGet(user.email).FirstOrDefault<string>();

                //handle name out of loop
                body = Utilities.ReplaceStringCaseInsensitive(body, "{FirstName}", userInfo.firstName);
                body = Utilities.ReplaceStringCaseInsensitive(body, "{LastName}", userInfo.lastName);
                //body = Utilities.ReplaceStringCaseInsensitive(body, "{Password}", password);

                foreach (KeyValuePair<string, string> code in customKeys)
                {
                    body = Utilities.ReplaceStringCaseInsensitive(body, code.Key, code.Value);
                    subject = Utilities.ReplaceStringCaseInsensitive(subject, code.Key, code.Value);
                }

                body = "<span style=\"font-family: Arial;font-size: 10pt;\">" + body + "</span>";

                WriteMsg("Sending email " + emailId + " to:" + userEmail);

                if (req.Url.Port==80 || req.Url.Port == 443)
                {
                    Utilities.SendEmail(userEmail, subject, body);
                }
            }
        }

        private void WriteMsg(string msg)
        {
            res.Write(DateTime.Now + ") " + msg + "\r");
            Log.Info(msg);
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