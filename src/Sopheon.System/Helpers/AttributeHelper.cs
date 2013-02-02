using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Sopheon.framework.Reflection
{
	public static class AttributeHelper
	{
		public static bool HasAttribute<ATTRIBUTETYPE>(this object subject)
		{
			var atts = subject is MemberInfo ? ((MemberInfo)subject).GetCustomAttributes(typeof(ATTRIBUTETYPE), true) : subject.GetType().GetCustomAttributes(typeof(ATTRIBUTETYPE), true);

			return atts.Count() > 0;
		}

		public static ATTRIBUTETYPE GetAttribute<ATTRIBUTETYPE>(this object subject)
		{
			var atts = subject is MemberInfo ? ((MemberInfo)subject).GetCustomAttributes(typeof(ATTRIBUTETYPE), true) : subject.GetType().GetCustomAttributes(typeof(ATTRIBUTETYPE), true);

			return (ATTRIBUTETYPE)atts.FirstOrDefault();
		}

		public static IDictionary<string, string> GetAttributesDictionary(this object subject)
		{
			Dictionary<string, string> vals = new Dictionary<string, string>();

			subject.GetType().GetProperties().ToList().ForEach(p => {
					vals.Add(p.Name, p.GetValue(subject, new object[] { }).ToString());
				});

			return (IDictionary<string, string>)vals;
		}
	}
}
