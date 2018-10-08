namespace NXLevel.LMS
{
    public class Breadcrumb
    {
        private string _pageTitle = "";
        private string _pageUrl = "";
 
        public Breadcrumb (string newTitle, string newUrl)
        {
            _pageTitle = newTitle;
            _pageUrl = newUrl;
        }
 
        public string PageUrl
        {
            get
            { return _pageUrl; }
        }

        public string PageTitle
        {
            get { return _pageTitle; }
        }

    }
}