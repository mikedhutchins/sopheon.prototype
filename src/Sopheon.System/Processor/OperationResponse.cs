using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Processor
{
	[Serializable]
	public class OperationResponse
	{
		const string FMT_RESPONSE = "[{1} :: {0}] {2}"; // 0 = , 1 = , 2

		public OperationResponse()
		{
			Messages = new List<OperationMessage>();

			State = ProcessorState.New;

			CurrentStepIndex = 0;

			CurrentStep = string.Empty;
		}

		public object Subject { get; set; }

		public ProcessorState State { get; set; }

		public List<OperationMessage> Messages { get; set; }

		public int CurrentStepIndex { get; set; }

		public string CurrentStep { get; set; }

		public string Name { get; set; }

		public string FinalMessage { get; set; }

		public override string ToString()
		{
			return string.Format(FMT_RESPONSE, Name, CurrentStep, string.Join(" | ", Messages.Select(x => x.Message)));
		}
	}

}
