using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;
using Sopheon.framework;

namespace Sopheon.Web.App.Models
{
    public class PanelViewModel
    {
        public PanelViewModel()
        {
            CssClasses = new List<string>();

            Attributes = new StringDictionary();
        }

        public string Id { get; set; }

        public List<string> CssClasses { get; set; }

        public StringDictionary Attributes { get; set; }

        public string PrimaryNavigationView { get; set; }

        public string SecondaryNavigationView { get; set; }

        public bool HideNav { get; set; }

        public string AttributeMl
        {
            get
            {
                List<string> results = new List<string>();
                foreach (var kvp in Attributes)
                {
                    results.Add("{Key}={Value}".SimpleBind(kvp));
                }

                return string.Join(" ", results.ToArray());
            }
        }
    }
}