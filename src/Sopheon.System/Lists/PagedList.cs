using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Lists
{
	public class PagedList<ITEMTYPE> : IPaged
	{
		public PagedList()
		{
			Items = new List<ITEMTYPE>();
		}
		
		public List<ITEMTYPE> Items { get; set; }

		public int PageSize { get; set; }

		public int TotalRecords { get; set; }

		public int CurrentIndex { get; set; }


	}
}
