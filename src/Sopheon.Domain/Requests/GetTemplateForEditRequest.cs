using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Processor;

namespace Sopheon.Domain.Requests
{
	public class GetTemplateForEditRequest
	{
		public int TemplateId { get; set; }

		public string Name { get; set; }
	}
}
