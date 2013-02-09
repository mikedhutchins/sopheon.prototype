using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Lists
{
	public static class PagedListHelper
	{
		public static IPaged Merge(this IPaged subject, IPaged source)
		{
			subject.CurrentIndex = source.CurrentIndex;

			subject.PageSize = source.PageSize;

			subject.TotalRecords = source.TotalRecords;

			return subject;
		}
	}
}
