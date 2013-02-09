using Sopheon.Domain.Entities;
using Sopheon.system.Lists;
using Sopheon.system.Processor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Responses
{
	public class GetGatesPagedListResponse : OperationResponse
	{
		public GetGatesPagedListResponse()
		{
			Subject = new PagedList<Gate>();
		}

		public PagedList<Gate> Templates
		{
			get
			{
				return (PagedList<Gate>)Subject;
			}
		}
	}
}
