using Sopheon.system.Lists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Requests
{
	public class GetGatesPagedListRequest
	{
		public PagedListFilteredBase Filter { get; set; }
	}
}
