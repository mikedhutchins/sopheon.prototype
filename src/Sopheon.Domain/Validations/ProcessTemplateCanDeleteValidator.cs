using Sopheon.Domain.Managers;
using Sopheon.Domain.Requests;
using Sopheon.system.Processor;
using Sopheon.system.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Validations
{
	
	public class ProcessTemplateCanDeleteValidator : ValidatorBase<GetTemplateForDeleteConfirmRequest>
	{
		private ProcessModelManager _processModelManager;

		public ProcessTemplateCanDeleteValidator(ProcessModelManager processModelManager)
		{
			_processModelManager = processModelManager;
		}

		[Validator(Sequence = 0)]
		public void CanDelete(Processor proc)
		{
			var response = _processModelManager.GetTemplateForEdit(Subject);

			proc.Evaluate(response.State == ProcessorState.Succeeded && response.Template.ProjectCount == 0, "This template is in use and cannot be deleted.");
		}
	}
}
