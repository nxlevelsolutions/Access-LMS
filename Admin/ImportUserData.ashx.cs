using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using NXLevel.LMS.DataModel;

namespace NXLevel.LMS.Admin
{
    /// <summary>
    /// Summary description for ImportUserData
    /// </summary>
    public class ImportUserData : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            string err = "";

            // check if a file needs to be uploaded
            if (context.Request.Files.Count == 1)
            {
                
                HttpPostedFile uploadedFile = context.Request.Files[0];
                if (uploadedFile?.ContentLength > 0)
                {
                    try
                    {
                        string category1 = null;
                        string category2 = null;
                        string category3 = null;
                        string category4 = null;
                        string category5 = null;

                        StreamReader st = new StreamReader(uploadedFile.InputStream);
                        //-----------------------------------------------
                        // scan the entire file and make sure it's CLEAN
                        //-----------------------------------------------
                        bool cleanData = true;
                        int row = 1;
                        string line;
                        string[] columns;
                        while ((line = st.ReadLine()) != null)
                        {
                            columns = line.Split('\t'); // split by TABS

                            if (row == 1)
                            {
                                //get headers - if any
                                if (columns.Length > 6)
                                {
                                    category1 = columns[6];
                                }
                                if (columns.Length > 7)
                                {
                                    category2 = columns[7];
                                }
                                if (columns.Length > 8)
                                {
                                    category3 = columns[8];
                                }
                                if (columns.Length > 9)
                                {
                                    category4 = columns[9];
                                }
                                if (columns.Length > 10)
                                {
                                    category5 = columns[10];
                                }
                            }
                            else
                            {

                                //check if there are TABS
                                if (columns.Length == 1)
                                {
                                    err = "Data rows need to be TAB delimited (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }

                                //check if there are at LEAST 6 columns
                                if (columns.Length < 7)
                                {
                                    err = "There should there be at least 6 columns (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }

                                //check data lengths of all required columns
                                if (columns[0].Trim().Length > 50) //check email
                                {
                                    err = "The max length of this email has been exceeded (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }
                                if (columns[1].Trim().Length > 50) //check first name
                                {
                                    err = "The max length of this first name has been exceeded (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }
                                if (columns[2].Trim().Length > 50) //check last name
                                {
                                    err = "The max length of this last name has been exceeded (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }
                                if (columns[3].Trim().Length == 0) //check default password
                                {
                                    err = "No default password has been specified (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }
                                if (columns[4].Trim().Length > 50) //check if title is too long
                                {
                                    err = "The max length of this title has been exceeded (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }
                                if (columns[5].Trim().Length > 50) //check if manager's email is too long
                                {
                                    err = "The max length of this manager's email has been exceeded (row " + row + ")";
                                    cleanData = false;
                                    break;
                                }

                                //check optional columns
                                if (category1?.Length > 0)
                                {
                                    if (columns[6].Trim().Length > 50) //check if optional field 1 is too long
                                    {
                                        err = "The max length of this optional field 1 has been exceeded (row " + row + ")";
                                        cleanData = false;
                                        break;
                                    }
                                }
                                if (category2?.Length > 0)
                                {
                                    if (columns[7].Trim().Length > 50) //check if optional field 2 is too long
                                    {
                                        err = "The max length of this optional field 2 has been exceeded (row " + row + ")";
                                        cleanData = false;
                                        break;
                                    }
                                }
                                if (category3?.Length > 0)
                                {
                                    if (columns[8].Trim().Length > 50) //check if optional field 3 is too long
                                    {
                                        err = "The max length of this optional field 3 has been exceeded (row " + row + ")";
                                        cleanData = false;
                                        break;
                                    }
                                }
                                if (category4?.Length > 0)
                                {
                                    if (columns[9].Trim().Length > 50) //check if optional field 4 is too long
                                    {
                                        err = "The max length of this optional field 4 has been exceeded (row " + row + ")";
                                        cleanData = false;
                                        break;
                                    }
                                }
                                if (category5?.Length > 0)
                                {
                                    if (columns[10].Trim().Length > 50) //check if optional field 5 is too long
                                    {
                                        err = "The max length of this optional field 5 has been exceeded (row " + row + ")";
                                        cleanData = false;
                                        break;
                                    }
                                }

                            }

                            row++;
                        }

                        if (cleanData)
                        {
                            lms_Entities db = new ClientDBEntities();

                            //-----------------------------------------------
                            // import the data file
                            //-----------------------------------------------
                            uploadedFile.InputStream.Position = 0;
                            row = 1;
                            while ((line = st.ReadLine()) != null)
                            {
                                if (row > 1) //skip headers
                                {
                                    columns = line.Split('\t');

                                    //import user data
                                    string email = columns[0].Trim();
                                    string fname = columns[1].Trim();
                                    string lname = columns[2].Trim();
                                    string pwd = columns[3].Trim();
                                    string title = columns[4].Trim();
                                    string mgrEmail = columns[5].Trim();
                                    string group1 = category1?.Length > 0 && columns.Length > 6 ? columns[6].Trim() : null;
                                    string group2 = category2?.Length > 0 && columns.Length > 7 ? columns[7].Trim() : null;
                                    string group3 = category3?.Length > 0 && columns.Length > 8 ? columns[8].Trim() : null;
                                    string group4 = category4?.Length > 0 && columns.Length > 9 ? columns[9].Trim() : null;
                                    string group5 = category5?.Length > 0 && columns.Length > 10 ? columns[10].Trim() : null;

                                    if (email.Length > 0)
                                    {
                                        //check if the user already exists
                                        int userId;
                                        User usr = db.Users.Where(u => u.email == email).FirstOrDefault();
                                        if (usr == null)
                                        {
                                            // user does not exist - add
                                            usr = new User
                                            {
                                                email = email,
                                                firstName = fname,
                                                lastName = lname,
                                                mgrEmail = mgrEmail,
                                                title = title,
                                                enabled = false, //disabled.. enabled after they set their password via access code
                                                role = (int)Role.Learner,
                                                timestamp = DateTime.Now
                                            };
                                            db.Users.Add(usr);
                                            db.SaveChanges();
                                            userId = usr.userId;
                                        }
                                        else
                                        {
                                            // user exists - update some data only
                                            usr.firstName = fname;
                                            usr.lastName = lname;
                                            usr.title = title;
                                            usr.mgrEmail = mgrEmail;
                                            db.SaveChanges();
                                            userId = usr.userId;
                                        }

                                        //clear out all previous imported user's group memberships
                                        //this will not modify manually-added user assignments 
                                        db.User_CategoryGroupSet(userId, null, null);

                                        //do optional fields
                                        if (category1?.Length > 0)
                                        {
                                            db.User_CategoryGroupSet(userId, category1, group1); // assign group to user
                                        }
                                        if (category2?.Length > 0)
                                        {
                                            db.User_CategoryGroupSet(userId, category2, group2); // assign group to user
                                        }
                                        if (category3?.Length > 0)
                                        {
                                            db.User_CategoryGroupSet(userId, category3, group3); // assign group to user
                                        }
                                        if (category4?.Length > 0)
                                        {
                                            db.User_CategoryGroupSet(userId, category4, group4); // assign group to user
                                        }
                                        if (category5?.Length > 0)
                                        {
                                            db.User_CategoryGroupSet(userId, category5, group5); // assign group to user
                                        }

                                    }

                                }
                                row++;
                            }

                            err = "Success! " + (row-2) + " row(s) were processed.";
                        }


                    }
                    catch (Exception ex)
                    {
                        err = ex.Message;
                        Log.Error(ex);
                    }
                }
                else
                {
                    //error empty file or incorrect data submitted
                    err = "Empty file";
                }

            }
            else
            {
                err = "No file was uploaded";
            }

            context.Response.ContentType = "application/json";
            context.Response.Write("{\"error\":\"" + err + "\"}");

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