using Sopheon.Domain.Entities.Filters;
using Sopheon.system.Lists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Requests
{
	public class GetGatesPagedListRequest
	{
		public GatesListFilter Filter { get; set; }
	}
}
