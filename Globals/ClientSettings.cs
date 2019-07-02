using System;
using System.Web;
using System.Configuration;

namespace NXLevel.LMS
{
    public class ClientSettings : ConfigurationSection
    {
        [ConfigurationProperty("clients")]
        public ClientElementCollection Clients
        {
            get {
                return (ClientElementCollection)this["clients"];
            }
        }

        public static ClientElementCollection Get()
        {
            ClientSettings settings = (ClientSettings)ConfigurationManager.GetSection("lmsClientSettingsSection");
            return settings.Clients;
        }

        public static ClientSetting Get(string clientName)
        {
            ClientSettings settings = (ClientSettings) ConfigurationManager.GetSection("lmsClientSettingsSection") ;
            foreach (ClientSetting client in settings.Clients)
            {
                if (clientName.Trim().ToUpper()==client.Code.ToUpper())
                {
                    return client;
                }
            }
            return null;
        }
    }

    [ConfigurationCollection(typeof(ClientSetting))]
    public class ClientElementCollection : ConfigurationElementCollection
    {
        public ClientSetting this[int index]
        {
            get { return (ClientSetting)BaseGet(index); }
            set
            {
                if (BaseGet(index) != null)
                    BaseRemoveAt(index);
                BaseAdd(index, value);
            }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new ClientSetting();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((ClientSetting)element).Name;
        }
        public void AddElement(string name, string entityConnStr)
        {
            ClientSetting ne = new ClientSetting();
            ne.Enabled = true;
            ne.Name = name;
            ne.EntityConnStr = entityConnStr;
            BaseAdd(this.Count, ne);
        }
    }

    public class ClientSetting : ConfigurationElement
    {
        [ConfigurationProperty("code", IsRequired = true)]
        public string Code
        {
            get { return (string)this["code"]; }
            //set { this["code"] = value; }
        }

        [ConfigurationProperty("name", IsRequired = true)]
        public string Name
        {
            get { return (string)this["name"]; }
            set { this["name"] = value; }
        }

        [ConfigurationProperty("enabled", IsRequired = true)]
        public bool Enabled
        {
            get {
                return ((bool)this["enabled"]);
            }
            set
            {
                this["enabled"] = value;
            }
        }

        [ConfigurationProperty("entityConnStr", IsRequired = true)]
        public string EntityConnStr
        {
            get { return (string)this["entityConnStr"]; }
            set { this["entityConnStr"] = value; }
        }

        [ConfigurationProperty("assetsFolder", IsRequired = true)]
        public string AssetsFolder
        {
            get { return (string)this["assetsFolder"]; }
            //set { this["assetsFolder"] = value; }
        }
    }
}
