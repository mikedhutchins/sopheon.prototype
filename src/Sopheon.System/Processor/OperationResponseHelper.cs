using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.UX;

namespace Sopheon.system.Processor
{
	public static class OperationResponseHelper
	{
		public static OperationResponse MergePartial(this OperationResponse target, OperationResponse subject)
		{
			target.State = target.State != ProcessorState.Succeeded && target.State != ProcessorState.New ? target.State : subject.State;

			target.Messages.AddRange(subject.Messages);

			return target;
		}

		public static OperationResponse Merge(this OperationResponse target, OperationResponse subject)
		{
			target.Name += subject.Name;

			target.MergePartial(subject);

			target.FinalMessage = !string.IsNullOrEmpty(subject.FinalMessage) ? subject.FinalMessage : target.FinalMessage;

			target.Subject = subject.Subject != null ? subject.Subject :  target.Subject;

			return target;
		}

		public static UiResponse ToUi<RESPONSET>(this RESPONSET source, Func<RESPONSET, string> viewBuilderF) where RESPONSET : OperationResponse
		{
			UiResponse newResponse = new UiResponse().Merge((OperationResponse)source) as UiResponse;

			newResponse.HtmlResult = viewBuilderF(source);

			return newResponse; 
		}

		public static T Get<T>(this OperationResponse subject)
		{
			return (T)subject.Subject;
		}
	}
}
