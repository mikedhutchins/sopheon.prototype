using Sopheon.Domain.Entities;
using Sopheon.Domain.Managers;
using Sopheon.system.Processor;
using Sopheon.system.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Validations
{
	public class ProcessTemplateUniquenessValidator : ValidatorBase<ProcessTemplate>
	{
		#region 
		private ProcessModelManager _manager;
		#endregion

		public ProcessTemplateUniquenessValidator(ProcessModelManager manager)
		{
			_manager = manager;
		}

		[Validator(Sequence=0)]
		public void IsItUnique(Processor proc)
		{
			var template = _manager.GetTemplateForEdit(new Requests.GetTemplateForEditRequest { Name = Subject.Name }).Template;

			if (!(template == null || (template.Name.Equals(Subject.Name) && template.Id.Equals(Subject.Id))))
			{
				proc.Fail("Process Model name was not unique.");
			}
		}
	}
}
