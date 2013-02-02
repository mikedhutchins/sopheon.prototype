using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Processor;
using Sopheon.Domain.Entities;

namespace Sopheon.Domain.Responses
{
	public class GetMyProcessTemplatesResponse : OperationResponse
	{
		public List<ProcessTemplate> Templates
		{
			get
			{
				return (List<ProcessTemplate>)Subject;
			}
		}

	}
}
