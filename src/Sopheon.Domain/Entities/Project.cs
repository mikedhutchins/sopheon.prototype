using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Entities
{
	public class Project
	{
		public string Name { get; set; }

		public int Id { get; set; }

		public int TemplateId  { get; set; }
	}
}
