using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using NXLevel.LMS.DataModel;
using System.Threading;
using System.Globalization;

namespace NXLevel.LMS
{
    public class MultiLanguagePage: Page
    {
        protected override void InitializeCulture()
        {
            string langCode;

            if (HttpContext.Current.Request.Cookies[Global.LANGUAGE_COOKIE] == null || HttpContext.Current.Request.Cookies[Global.LANGUAGE_COOKIE].Value == "")
            {
                langCode = "en-US"; //default to english
            }
            else
            {
                langCode = HttpContext.Current.Request.Cookies[Global.LANGUAGE_COOKIE].Value;
            }

            this.UICulture = langCode;
            this.Culture = langCode;
            Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(langCode);
            Thread.CurrentThread.CurrentUICulture = new CultureInfo(langCode);

            base.InitializeCulture();
        }
    }
}