using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using Sopheon.framework;

namespace Sopheon.system.Processor
{
	public class Processor
	{
		public OperationResponse Response { get; set; }

		#region cstor
		public Processor() : this((ex, proc) => { }, string.Empty) { }

		public Processor(string name) : this((ex, proc) => { }, name) { }

		public Processor(Action<Exception, Processor> onException) : this(onException, string.Empty) { }

		public Processor(Action<Exception, Processor> onException, string name)
		{
			_onException = onException;

			if (string.IsNullOrEmpty(name))
			{
				StackTrace stackTrace = new StackTrace();           // get call stack

				name = stackTrace.GetFrames().Skip(2).Take(1).Select(x => x.GetMethod().DeclaringType.Name + " :: " + x.GetMethod().Name).First();

			}

			Response = new OperationResponse() { Name = name };
		}
		#endregion

		Action<Exception, Processor> _onException;

		public Processor SetResponse(OperationResponse response)
		{
			this.Response = response;

			return this;
		}

		public bool Fail()
		{
			return Fail(string.Empty);
		}

		public bool Fail(string message)
		{
			message = string.IsNullOrEmpty(message) ? "Failure occurred." : message;

			Response.State = ProcessorState.Failed;

			Response.Messages.Add(new OperationMessage { State = ProcessorState.Failed, Message = message });

			Log("Failure");

			return false;
		}

		public Processor For(string stepName, int index, Action<Processor, int> operation)
		{
			for (int idx = 0; idx < index; idx++)
			{
				this.Then(stepName, (p) => { operation(this, idx); });
			}
			return this;
		}

		public Processor For(int index, Action<Processor, int> operation)
		{
			return For(string.Empty, index, operation);
		}

		public bool Continue()
		{
			return true;
		}

		public bool Evaluate(bool value, string message)
		{
			return value ? Continue() : Fail(message);
		}

		public bool Evaluate(bool value)
		{
			return Evaluate(value, string.Empty);
		}

		public Processor Then(Action<Processor> operation)
		{
			return Then(string.Empty, operation);
		}

		public Processor Then(string stepName, Action<Processor> operation)
		{
			Response.State = Response.State == ProcessorState.New ? ProcessorState.Succeeded : Response.State;

			if (Response.State == ProcessorState.Succeeded)
			{
				try
				{
					Response.CurrentStepIndex++;

					Response.CurrentStep = string.IsNullOrEmpty(stepName) ? string.Format("Step# {0}", Response.CurrentStepIndex) : stepName;

					operation(this);
				}
				catch (Exception ex)
				{
					Response.State = ProcessorState.Exception;

					Response.Messages.Add(new OperationMessage {
						State = ProcessorState.Exception,
						Exception = ex,
						Message = ex.Message
					});

					Log("Exception");

					_onException(ex, this);
				}
			}
			return this;
		}

		private void Log(string message)
		{
			StackTrace stackTrace = new StackTrace();           // get call stack

			string stackFrames = string.Join("\n", stackTrace.GetFrames().Select(x => (x.GetMethod().DeclaringType == null ? "<lambda>" : x.GetMethod().DeclaringType.Name) + " :: " + x.GetMethod().Name));  // get method calls (frames)

			string msg = string.Join("|", this.Response.Messages.Select(x => x.Message));

			string stepAndContext = "CONTEXT: {context} at step# {idx}".SimpleBind(new { idx = Response.CurrentStepIndex, context = this.Response.Name });

			EventLog.WriteEntry("Application", "{context} : {Status} \n\n--------------------------------------\n\n MESSAGE: {msg}\n\n {stack}".SimpleBind(new { context = stepAndContext, Status = Response.State.ToString(), msg = msg, stack = stackFrames }), EventLogEntryType.Error);
		}

	}
}
