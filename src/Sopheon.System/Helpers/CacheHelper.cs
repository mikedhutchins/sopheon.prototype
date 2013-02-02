using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Caching;

namespace Sopheon.framework
{
	public class CacheInfo<T>
	{
		public CacheInfo()
		{
			this.Priority = CacheItemPriority.Normal;

			this.Minutes = 10;
		}

		public static int Day = 60 * 24;

		public static int Minute = 1;

		public static int Hour = 60;

		public static int Week = 60 * 24 * 7;

		public Func<T> LoadOnExp { get; set; }

		public int Minutes { get; set; }

		public string Key { get; set; }

		public CacheItemPriority Priority { get; set; }

		public DateTime Until
		{
			get
			{
				return DateTime.Now.AddMinutes(Minutes);
			}
		}
	}

	public static class CacheHelper
	{
		public static void Refresh(string key)
		{
			Cache c = System.Web.HttpContext.Current.Cache;

			c.Remove(key);
		}

		public static bool CanCache()
		{
			return System.Web.HttpContext.Current != null;
		}

		public static T Get<T>(CacheInfo<T> info)
		{
			Cache c = System.Web.HttpContext.Current.Cache;

			CacheItemRemovedCallback cb = null;
			
			cb = new CacheItemRemovedCallback ((key, value, reason) => {
				c.Add(info.Key, info.LoadOnExp.Invoke(), null, info.Until, Cache.NoSlidingExpiration, info.Priority, cb);
			});

			var r = c.Get(info.Key);

			if (r == null)
			{
				c.Add(info.Key, info.LoadOnExp.Invoke(), null, info.Until, Cache.NoSlidingExpiration, info.Priority, cb);

				r = c.Get(info.Key);
			}

			return (T)r;
		}

	}
}
