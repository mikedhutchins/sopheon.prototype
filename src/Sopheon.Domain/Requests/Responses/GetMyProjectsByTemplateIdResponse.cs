using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Processor;
using Sopheon.Domain.Entities;

namespace Sopheon.Domain.Responses
{
	public class GetMyProjectsByTemplateIdResponse : OperationResponse
	{
		public List<Project> Projects 
		{
			get
			{
				return (List<Project>)Subject;
			}
		}
	}
}
