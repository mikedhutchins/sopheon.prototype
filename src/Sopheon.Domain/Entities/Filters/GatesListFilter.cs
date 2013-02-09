using Sopheon.system.Lists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Entities.Filters
{
	public class GatesListFilter : PagedListFilteredBase
	{
		public string ProjectIds { get; set; }
	}
}
