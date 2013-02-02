using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Entities
{
	public class Gate
	{
		public int Id { get; set; }

		public string Name { get; set; }

		public DateTime ScheduledCompletion { get; set; }
	}
}
