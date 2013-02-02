using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using Sopheon.framework.Reflection;

namespace Sopheon.framework
{
	public static class Parsers
	{
		public static int ToInt(this object subject)
		{
			int n = 0;

			int.TryParse(subject.ToString(), out n);

			return n;
		}


		public static bool ToBool(this object subject)
		{
			return subject.ToBool(false);
		}

		public static bool ToBool(this object subject, bool def)
		{
			bool val = def;

			bool.TryParse(subject.ToString(), out val);

			return val;
		}
		
		public static string GetPropertiesString(this object subject, string template)
		{
			return subject.GetPropertiesString(template, string.Empty);
		}

		public static string GetPropertiesString(this object subject, string template, string delimiter)
		{
			return string.Join(delimiter, subject.GetType().GetProperties().Select(x => template.SimpleBind(new { name = x.Name, value = subject.GetProperty(x.Name) })).ToArray());
		}

		public static string SimpleBind(this string template, object subject)
		{
			string final = template;

			subject.GetType().GetProperties().ToList().ForEach(p =>
				{
					object val = p.GetValue(subject, new object[] { });
					
					final = final.Replace("{" + p.Name + "}", (val ?? string.Empty).ToString());
				});

			return final;
		}

		public static StringDictionary MapModel(this object subject)
		{
			StringDictionary dict = new StringDictionary();

			subject.GetType().GetProperties().ToList().ForEach(p =>
			{
				dict.Add (p.Name, p.GetValue(subject, new object[] { }).ToString());
			});

			return dict;
		}
	}
}
