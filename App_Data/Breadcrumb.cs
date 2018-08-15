namespace NXLevel.LMS
{
    public class Breadcrumb
    {
        #region Fields

        private string _pageTitle = string.Empty;
        private string _pageUrl = string.Empty;

        #endregion

        #region Constructor

        public Breadcrumb (string newTitle, string newUrl)
        {
            _pageTitle = newTitle;
            _pageUrl = newUrl;
        }

        #endregion

        #region Properties

        public string PageUrl
        {
            get
            { return _pageUrl; }
        }

        public string PageTitle
        {
            get { return _pageTitle; }
        }

        #endregion
    }
}