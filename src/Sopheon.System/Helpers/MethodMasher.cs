using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace Sopheon.framework.Reflection
{
	public static class MethodMasher
	{
		const string EXC_METHOD_NOT_FOUND = "Method {0} not found on {1}";

		public static T ExecIfHasMeth<T>(this object subject, string method)
		{
			return subject.ExecIfHasMeth<T>(method, new object[] { });
		}

		public static T ExecIfHasMeth<T>(this object subject, string method, Func<MethodInfo, bool> executionCondition)
		{
			return subject.ExecIfHasMeth<T>(method, new object[] { }, executionCondition);
		}

		public static T ExecIfHasMeth<T>(this object subject, string method, object[] args, Func<MethodInfo, bool> executionCondition)
		{
			var meth = subject.GetType().GetMethod(method);

			if (meth != null && executionCondition(meth))
			{
				return subject.Exec<T>(method, args);
			}
			return default(T);
		}
	
		public static T ExecIfHasMeth<T>(this object subject, string method, object[] args)
		{
			if (subject.GetType().GetMethod(method) != null)
			{
				return subject.Exec<T>(method, args);
			}
			return default(T);
		}

		public static T Exec<T>(this object subject, string method, object[] args)
		{
			return (T)subject.Exec(method, args);
		}

		public static T Exec<T>(this object subject, string method)
		{
			return (T)subject.Exec(method, new object [] { });
		}

		public static object Exec(this object subject, string method, object[] args)
		{
			var methodInfo = subject.GetType().GetMethod(method, BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance | BindingFlags.FlattenHierarchy);

			if (methodInfo != null)
			{
				return methodInfo.Invoke(subject, args);
			}
			else
			{
				throw new Exception(String.Format(EXC_METHOD_NOT_FOUND, method, subject.GetType().FullName));
			}

			return null;
		}

		public static T Exec<T>(this Type subject, string method, object[] args)
		{
			return (T)subject.Exec(method, args);
		}

		public static object Exec(this Type subject, string method, object[] args)
		{
			var methodInfo = subject.GetMethod(method, BindingFlags.NonPublic | BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static);

			if (methodInfo != null)
			{
				return methodInfo.Invoke(subject, args);
			}
			else
			{
				throw new Exception(String.Format(EXC_METHOD_NOT_FOUND, method, subject.GetType().FullName));
			}
			return null;
		}
	}
}
