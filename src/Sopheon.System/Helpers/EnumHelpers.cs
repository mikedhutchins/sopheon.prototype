using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.framework
{
	public static class EnumHelper
	{
		public static bool ContainsMatch<ENUMTYPE>(this ENUMTYPE value, ENUMTYPE compare) where ENUMTYPE : struct
		{
			var values = value.GetFlags<ENUMTYPE>();

			var compares = compare.GetFlags<ENUMTYPE>();

			return values.Join(compares, x => x, y => y, (x, y) => true).Count(x => x) > 0;
		}

		public static IEnumerable<ENUMTYPE> GetFlags<ENUMTYPE>(this ENUMTYPE value)
		{
			foreach (var e in GetRealValues<ENUMTYPE>())
			{
				if ((((int)(object)value & (int)(object)e) == (int)(object)e))
				{
					yield return e;
				}
			}
		}

		public static IEnumerable<ENUMTYPE> GetRealValues<ENUMTYPE>()
		{
			return Enum.GetNames(typeof(ENUMTYPE))
				.Select(v => (ENUMTYPE)Enum.Parse(typeof(ENUMTYPE), v));
		}
	}
}
