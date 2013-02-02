using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Sopheon.framework.Reflection
{
	[AttributeUsage(validOn: AttributeTargets.Property | AttributeTargets.Class)]
	public class JiggyIgnoreAttribute : Attribute
	{

	}

	public static class PropertyMangler
	{
		public static List<PropertyInfo> GetPropertyInfos(this object subject)
		{
			return subject.GetPropertyInfos(x => true);
		}

		public static List<PropertyInfo> GetPropertyInfos(this object subject, Func<PropertyInfo, bool> predicate)
		{
			return subject.GetType().GetProperties().Where(x => predicate.Invoke(x)).ToList();
		}

		public static List<PropertyInfo> GetPropertyInfos(this Type subject)
		{
			return subject.GetPropertyInfos(x => true);
		}

		public static List<PropertyInfo> GetPropertyInfos(this Type subject, Func<PropertyInfo, bool> predicate)
		{
			return subject.GetProperties().Where(x => predicate.Invoke(x)).ToList();
		}

		public static PropertyInfo GetPropertyInfoNoCase(this object subject, string name)
		{
			return subject.GetType().GetProperty(name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
		}

		public static object GetPropertyNoCase(this object subject, string name)
		{
			return subject.GetType().GetProperty(name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(subject, null);
		}

		public static T GetPropertyNoCase<T>(this object subject, string name)
		{
			return (T)subject.GetType().GetProperty(name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).GetValue(subject, null);
		}

		public static object GetProperty(this object subject, string name)
		{
			return subject.GetType().GetProperty(name).GetValue(subject, null);
		}

		public static T GetProperty<T>(this object subject, string name)
		{
			return (T)subject.GetType().GetProperty(name).GetValue(subject, null);
		}

		public static bool HasProperty(this object subject, string name)
		{
			return subject.GetType().GetProperty(name) != null;
		}

		public static bool HasMethod(this object subject, string name)
		{
			return subject.GetType().GetMethod(name) != null;
		}

		public static void SetProperty(this object subject, string name, object value)
		{
			subject.GetType().GetProperty(name).SetValue(subject, value, null);
		}

		public static string GetJiggy(this object subject, Func<string, object, PropertyInfo, string> propertyDel)
		{
			StringBuilder final = new StringBuilder();

			subject.GetType().GetProperties().ToList().ForEach(prop =>
			{
				if (prop.GetCustomAttributes(typeof(JiggyIgnoreAttribute), true).Length==0)
				{
					string result = propertyDel.Invoke(prop.Name, prop.GetValue(subject, new object[] { }), prop);

					final.Append(result);
				}
			});
			
			return final.ToString();
		}

		public static void Map<T_TO, T_FROM>(this T_FROM source, T_TO subject)
		{
			foreach (PropertyInfo prop in source.GetType().GetProperties())
			{
				var subProp = subject.GetType().GetProperty(prop.Name);

				if (subProp != null && prop.PropertyType.Equals(subProp.PropertyType))
				{
					subject.SetProperty(prop.Name, source.GetProperty(prop.Name));
				}
			}
		}

		public static T GetIt<T>(this object subject, Func<T> property, Action setter)
		{
			if (property() == null)
			{
				setter();
			}
			return property();
		}

		public static void SetIt(Action setter)
		{
			setter();
		}

	}
}
