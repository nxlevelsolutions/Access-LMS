using System;
using System.IO;
using System.IO.Compression;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Configuration;
using System.Xml;

namespace NXLevel.LMS.Admin
{
    /// <summary>
    /// Summary description for ImportCourse
    /// </summary>
    public class ImportCourse : IHttpHandler, System.Web.SessionState.IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            var manifestObj = new object();
            string errMsg = "";

            // check if a file needs to be uploaded
            if (context.Request.Files.Count == 1)
            {
                HttpPostedFile uploadedFile = context.Request.Files[0];
                if (uploadedFile?.ContentLength > 0)
                {
                    string filename = uploadedFile.FileName;
                    int? courseId = Utilities.TryToParseAsInt(context.Request.Form["courseId"]);
                    string courseType = context.Request.Form["type"].ToUpper();
                    string assetAbsPath = Path.Combine(new string[] { HttpContext.Current.Server.MapPath("~/courses"), LmsUser.assetsFolder, courseId.ToString()});

                    if (courseId > 0)
                    {
                        if (courseType == "AICC" || courseType == "SCORM")
                        {
                            if (filename.EndsWith(".zip"))
                            {
                                try
                                {
                                    // make sure the folder exists
                                    if (Directory.Exists(assetAbsPath))
                                    {
                                        EmptyDirectory(assetAbsPath);
                                    }
                                    else
                                    {
                                        Directory.CreateDirectory(assetAbsPath);
                                    }

                                    //unzip it
                                    Log.Info("Unzipping " + filename + " to " + assetAbsPath);
                                    ZipArchive zipArch = new ZipArchive(uploadedFile.InputStream);
                                    zipArch.ExtractToDirectory(assetAbsPath);

                                    //get the manifests' data
                                    if (courseType == "AICC")
                                    {
                                        string auManifest;
                                        string crsManifest;
                                        string[] files;
                                        files = Directory.GetFiles(assetAbsPath, "*.au");
                                        if (files.Length == 1)
                                        {
                                            auManifest = files[0];
                                            files = Directory.GetFiles(assetAbsPath, "*.crs");
                                            if (files.Length == 1)
                                            {
                                                crsManifest = files[0];
                                                manifestObj = GetAICCManifestData(assetAbsPath, auManifest, crsManifest, out errMsg);
                                            }
                                            else
                                            {
                                                errMsg = "The \".CRS\" file is required";
                                            }
                                        }
                                        else
                                        {
                                            errMsg = "The \".AU\" file is required";
                                        }

                                    }
                                    if (courseType == "SCORM")
                                    {
                                        if (File.Exists(assetAbsPath + "\\imsmanifest.xml"))
                                        {
                                            manifestObj = GetSCORMManifestData(assetAbsPath, out errMsg); 
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
                            errMsg = "No course type specified";
                        }
                    }
                    else
                    {
                        errMsg = "No course ID was specified";
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


            context.Response.ContentType = "application/json";
            var resObj = new { error = errMsg, data = manifestObj };
            context.Response.Write(jsSerializer.Serialize(resObj));
        }

        private object GetAICCManifestData(string folderPath, string auManifest, string crsManifest, out string errMsg)
        {
            errMsg = "";
            string title = "";
            string description = "";
            string startPage = "";
            int i;

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


            return new
            {
                title = title,
                description = description,
                startPage = startPage
            };
        }

        private object GetSCORMManifestData(string folderPath, out string errMsg)
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
                    title = general.SelectSingleNode("title/langstring")?.InnerText;
                    description = general.SelectSingleNode("description/langstring")?.InnerText;
                    startPage = doc.SelectSingleNode("manifest/resources/resource")?.Attributes["href"].Value;
                }
            }
            catch (Exception e)
            {
                errMsg = e.Message;
                Log.Error(e);
            }

            return new {
                title = title,
                description = description,
                startPage = startPage
            };
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