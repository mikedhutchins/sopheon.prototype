using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Processor;
using Sopheon.Domain.Entities;

namespace Sopheon.Domain.Responses
{
	public class GetTemplateForEditResponse : OperationResponse
	{
		public ProcessTemplate Template
		{
			get
			{
				return (ProcessTemplate)Subject;
			}
		}	
	}
}
