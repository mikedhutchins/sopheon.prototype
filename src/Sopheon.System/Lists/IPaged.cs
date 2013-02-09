using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Lists
{
	public interface IPaged
	{
		int PageSize { get; set; }

		int TotalRecords { get; set; }

		int CurrentIndex { get; set; }
	}
}
