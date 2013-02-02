using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using d = Sopheon.Data;
using System.Configuration;
using System.Text.RegularExpressions;
using Sopheon.framework.Repository;
using System.Data.Objects;
using Sopheon.Domain.Contracts;
using Sopheon.Domain.Responses;
using Sopheon.system.Processor;
using Sopheon.Repository.Mappings;
using Sopheon.framework.Reflection;
using Sopheon.framework;
using Sopheon.Domain.Requests;

namespace Sopheon.Repository.Queries
{
	public class GetMyProcessTemplatesQuery : IGetMyProcessTemplatesQuery
	{
		#region definitions
		d.SopheonEntities _context;

		private GetMyProcessTemplatesRequest _request;

		private GetMyProcessTemplatesResponse _response;
		#endregion

		#region cstr
		public GetMyProcessTemplatesQuery(GetMyProcessTemplatesRequest request)
		{
			_request = request;

			_response = new GetMyProcessTemplatesResponse();
		}
		#endregion

		public OperationResponse Execute(ObjectContext context)
		{
			Processor processor = new Processor().SetResponse(_response)
				#region step #1 get context
				.Then((p) => { _context = (d.SopheonEntities)context; })
				#endregion

				#region step #2 get stuff
				.Then((p) => {
					_response.Subject = _context.ProcessTemplates.ToArray().Select(temp => temp.ToDomainModel()).ToList();
				})
				#endregion
				;

			return _response;
		}
	}
}
