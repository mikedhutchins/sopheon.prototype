using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Processor
{
	[Serializable]
	public class OperationMessage
	{
		public ProcessorState State { get; set; }

		public Exception Exception { get; set; }

		public string Message { get; set; }
	}
}
