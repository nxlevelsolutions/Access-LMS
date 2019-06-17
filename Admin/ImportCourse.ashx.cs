using System;
using System.IO;
using System.IO.Compression;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Configuration;
using System.Xml;
using NXLevel.LMS.DataModel;
using System.Configuration;

namespace NXLevel.LMS.Admin
{
    /// <summary>
    /// Summary description for ImportCourse
    /// </summary>
    public class ImportCourse : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            CourseInfo? courseInfo = null;
            string errMsg = "";
            string filename = "";
            int? courseId = null;
            CourseType courseType = (CourseType)short.Parse(context.Request.Form["type"]);

            // check if a file needs to be uploaded
            if (context.Request.Files.Count == 1)
            {
                HttpPostedFile uploadedFile = context.Request.Files[0];
                if (uploadedFile?.ContentLength > 0)
                {
                    filename = uploadedFile.FileName;
                    courseId = Utilities.TryToParseAsInt(context.Request.Form["courseId"]);
                    if (courseId == null)
                    {
                        errMsg = "No course ID was specified";
                    }
                    else
                    {
                        string courseAbsPath = Path.Combine(new string[] {
                            HttpContext.Current.Server.MapPath("~/" + Global.WEBSITE_COURSES_FOLDER),
                            LmsUser.companyFolder,
                            courseId.ToString()
                        });
                    
                        if (courseType == CourseType.AICC || courseType == CourseType.SCORM)
                        {
                            if (filename.EndsWith(".zip"))
                            {
                                try
                                {
                                    // make sure the folder exists
                                    if (Directory.Exists(courseAbsPath))
                                    {
                                        EmptyDirectory(courseAbsPath);
                                    }
                                    else
                                    {
                                        Directory.CreateDirectory(courseAbsPath);
                                    }

                                    //unzip it
                                    Log.Info("Unzipping " + filename + " to " + courseAbsPath);
                                    ZipArchive zipArch = new ZipArchive(uploadedFile.InputStream);
                                    zipArch.ExtractToDirectory(courseAbsPath);

                                    //get the manifests' data
                                    if (courseType == CourseType.AICC)
                                    {
                                        string auManifest;
                                        string crsManifest;
                                        string[] files;
                                        files = Directory.GetFiles(courseAbsPath, "*.au");
                                        if (files.Length == 0)
                                        {
                                            errMsg = "The \".AU\" file (manifest) was not found.";
                                        }
                                        else
                                        {
                                            auManifest = files[0];
                                            files = Directory.GetFiles(courseAbsPath, "*.crs");
                                            if (files.Length == 0)
                                            {
                                                errMsg = "The \".CRS\" file (manifest) was not found";
                                            }
                                            else
                                            {
                                                crsManifest = files[0];
                                                courseInfo = GetAICCManifestData(courseAbsPath, auManifest, crsManifest, out errMsg);

                                                if (courseInfo == null)
                                                {
                                                    // errMsg already set by function if courseInfo == null;
                                                }
                                                else
                                                {
                                                    //check data in manifest
                                                    if (courseInfo?.title.Trim().Length == 0)
                                                    {
                                                        errMsg = "The title is empty in the manifest";
                                                    }
                                                    if (courseInfo?.startPage.Trim().Length == 0)
                                                    {
                                                        errMsg = "The start page is empty in the manifest";
                                                    }
                                                }
                                            }
                                        }

                                    }
                                    if (courseType == CourseType.SCORM)
                                    {
                                        if (File.Exists(courseAbsPath + "\\imsmanifest.xml"))
                                        {
                                            courseInfo = GetSCORMManifestData(courseAbsPath, out errMsg);

                                            if (courseInfo == null)
                                            {
                                                // errMsg already set by function if courseInfo == null;
                                            }
                                            else
                                            {
                                                //check data in manifest
                                                if (courseInfo?.title.Trim().Length == 0)
                                                {
                                                    errMsg = "The title is empty in the manifest";
                                                }
                                                if (courseInfo?.startPage.Trim().Length == 0)
                                                {
                                                    errMsg = "The start page is empty in the manifest";
                                                }
                                            }
                                        }
                                        else
                                        {
                                            errMsg = "Missing imsmanifest.xml file.";
                                        }
                                    }
                                        

                                }
                                catch (IOException exc)
                                {
                                    //error configuration/write permission error
                                    Log.Error(exc);
                                    errMsg = exc.Message;
                                }
                            }
                            else
                            {
                                errMsg = "Uploaded file is not a Zip file";
                            }
                        }
                        else
                        {
                            if (courseType == CourseType.READ_AND_SIGN)
                            {
                                // make sure the folder exists
                                if (Directory.Exists(courseAbsPath))
                                {
                                    EmptyDirectory(courseAbsPath);
                                }
                                else
                                {
                                    Directory.CreateDirectory(courseAbsPath);
                                }

                                //save file
                                uploadedFile.SaveAs(courseAbsPath + "\\" + filename);
                            }
                            else
                            {
                                errMsg = "No course type was specified";
                            }
                        }
                    }
                }
                else
                {
                    //error empty file or incorrect data submitted
                    errMsg = "File uploaded is empty";
                }
            }
            else
            {
                //error no file submitted
                errMsg = "No file uploaded";
            }



            if (errMsg.Length == 0)
            {
                //============================================
                // At this point the upload process went ok so
                // update the db course info with updated info
                //============================================
                try
                {
                    lms_Entities db = new ClientDBEntities();
                    Course csr = db.Courses.Where(u => u.courseId == courseId).FirstOrDefault();
                    if (courseType == CourseType.READ_AND_SIGN)
                    {
                        csr.type = (short)courseType;
                        csr.url = Global.WEBSITE_COURSES_FOLDER + "/" + LmsUser.companyFolder + "/" + courseId + "/" + filename;
                        Log.Info("CourseId " + courseId + " updated file:" + filename);
                    }
                    else
                    {
                        csr.title = courseInfo?.title;
                        csr.description = courseInfo?.description;
                        csr.type = (short)courseType;
                        csr.url = Global.WEBSITE_COURSES_FOLDER + "/" + LmsUser.companyFolder + "/" + courseId + "/" + courseInfo?.startPage;
                        Log.Info("CourseId " + courseId + " updated from manifest.");
                    }
                    db.SaveChanges();
                    
                }
                catch (Exception e)
                {
                    errMsg = e.Message;
                    Log.Error(e);
                }

            }
            else
            {
                Log.Error(errMsg);
            }

            context.Response.ContentType = "application/json";
            context.Response.Write(JsonResponse.Data(errMsg, courseInfo));
        }

        private CourseInfo? GetAICCManifestData(string folderPath, string auManifest, string crsManifest, out string errMsg)
        {
            errMsg = "";
            string title = "";
            string description = "";
            string startPage = "";
            int i;

            try
            {
                //get course title & description
                string[] crc = File.ReadAllLines(crsManifest);
                for (i = 0; i < crc.Length; i++)
                {
                    string line = crc[i].Trim();
                    if (line.StartsWith("course_title", StringComparison.CurrentCultureIgnoreCase))
                    {
                        title = line.Substring(line.IndexOf("=") + 1);
                    }
                    if (line.StartsWith("[course_description]", StringComparison.CurrentCultureIgnoreCase))
                    {
                        i++;
                        break;
                    }
                }
                if (i < crc.Length)
                {
                    for (;  i < crc.Length; i++)
                    {
                        description += crc[i].Trim();
                    }
                }

                //get start page
                string[] au = File.ReadAllLines(auManifest);
                string[] parms;
                if (au.Length > 1)
                {
                    parms = au[1].Split(',');
                    startPage = parms[2]; //3rd item is "file_name" (start page)
                    startPage = startPage.Replace("\"", "");
                }

                //return generic object
                return new CourseInfo
                {
                    title = title,
                    description = description,
                    startPage = startPage
                };
            }
            catch (Exception e)
            {
                errMsg = e.Message;
                Log.Error(e);
            }

            return null;

        }

        private CourseInfo? GetSCORMManifestData(string folderPath, out string errMsg)
        {
            errMsg = "";
            string title = "";
            string description = "";
            string startPage = "";

            //load main manifest
            try
            {
                using (XmlTextReader xmlReader = new XmlTextReader(folderPath + "\\imsmanifest.xml"))
                {
                    XmlDocument doc = new XmlDocument();
                    xmlReader.Namespaces = false;
                    doc.Load(xmlReader);

                    //parse data out
                    XmlNode general = doc.DocumentElement.SelectSingleNode("/manifest/metadata/lom/general");
                    if (general == null)
                    {
                        //try just the title in different location
                        title = doc.DocumentElement.SelectSingleNode("/manifest/organizations/organization/title")?.InnerText;
                    }
                    else
                    {
                        title = general.SelectSingleNode("title/langstring")?.InnerText;
                        description = general.SelectSingleNode("description/langstring")?.InnerText;
                    }
                    startPage = doc.SelectSingleNode("manifest/resources/resource")?.Attributes["href"].Value;

                    return new CourseInfo
                    {
                        title = title,
                        description = description,
                        startPage = startPage
                    };
                }
            }
            catch (Exception e)
            {
                errMsg = e.Message;
                Log.Error(e);
            }

            return null;

        }

        private struct CourseInfo{
            public string title;
            public string description;
            public string startPage;
        }

        private void EmptyDirectory(string targetFolder, bool deleteFolder = false)
        {
            // this method wipes out all data inside a folder, but does not 
            // delete the root folder itself.
            string[] files = Directory.GetFiles(targetFolder);
            string[] dirs = Directory.GetDirectories(targetFolder);

            foreach (string file in files)
            {
                File.SetAttributes(file, FileAttributes.Normal);
                File.Delete(file);
            }

            foreach (string dir in dirs)
            {
                EmptyDirectory(dir, true);
            }

            if (deleteFolder) Directory.Delete(targetFolder, false);
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