using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Lists
{
	public class PagedListFilteredBase : IPaged
	{
		public int PageSize { get; set; }

		public int TotalRecords { get; set; }

		public int CurrentIndex { get; set; }
	}
}
