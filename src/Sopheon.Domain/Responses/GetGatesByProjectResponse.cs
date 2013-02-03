using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Processor;
using Sopheon.Domain.Entities;

namespace Sopheon.Domain.Responses
{
	public class GetGatesByProjectResponse : OperationResponse
	{
		public List<Gate> Gates
		{
			get
			{
				return (List<Gate>)Subject;
			}
		}
	}
}
