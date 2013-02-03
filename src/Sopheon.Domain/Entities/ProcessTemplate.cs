using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Entities
{
	public class ProcessTemplate
	{
		public int Id { get; set; }

		public string Name { get; set; }

        public int ProjectCount { get; set; }
	}
}
