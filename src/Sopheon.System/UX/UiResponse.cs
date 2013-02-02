using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Processor;

namespace Sopheon.system.UX
{
	public class UiResponse : OperationResponse
	{
		public string HtmlResult { get; set; }

		public object Payload { get; set; }

	}
}
