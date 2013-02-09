using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Processor;
using Sopheon.Domain.Entities;
using Sopheon.system.Lists;

namespace Sopheon.Domain.Responses
{
	public class GetGatesByProjectResponse : OperationResponse
	{
		public PagedList<Gate> Gates
		{
			get
			{
				return (PagedList<Gate>)Subject;
			}
		}
	}
}
