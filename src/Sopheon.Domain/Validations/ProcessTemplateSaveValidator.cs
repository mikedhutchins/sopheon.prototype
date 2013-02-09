using Sopheon.Domain.Entities;
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
	public class ProcessTemplateSaveValidator : ValidatorBase<SaveProcessTemplateRequest>
	{
		#region fields
		private ProcessModelManager _manager;
		#endregion

		#region cstor
		public ProcessTemplateSaveValidator(ProcessModelManager manager)
		{
			_manager = manager;
		}
		#endregion

		#region validators
		[Validator(Sequence=0, ShouldFail=true)]
		public void ShouldBeUnique(Processor proc)
		{
			var template = _manager.GetTemplateForEdit(new Requests.GetTemplateForEditRequest { Name = Subject.Template.Name }).Template;

			if (!(template == null || (template.Name.Equals(Subject.Template.Name) && template.Id.Equals(Subject.Template.Id))))
			{
				proc.Fail("Process Model name was not unique.");
			}
		}
		[Validator(Sequence = 1, Context=ValidatorContexts.Web)]
		public void ShouldSmellGood(Processor proc)
		{
			proc.Fail("Process model smelled bad.");
		}
		#endregion
	}
}
