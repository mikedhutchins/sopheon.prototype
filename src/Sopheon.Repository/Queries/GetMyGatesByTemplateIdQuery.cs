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
	public class GetMyGatesByTemplateQuery : IGetMyGatesByTemplateIdQuery
	{
		#region definitions
		d.SopheonEntities _context;

		private GetGatesByProjectIdRequest  _request;

		private GetGatesByProjectResponse _response;
		#endregion

		#region cstr
		public GetMyGatesByTemplateQuery(GetGatesByProjectIdRequest request)
		{
			_request = request;

			_response = new GetGatesByProjectResponse();
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
					_response.Subject = _context.Gates.Where(x => x.ProjectId.Equals(_request.ProjectId)).ToArray().Select(temp => temp.ToDomainModel()).ToList();
				})
				#endregion
				;

			return _response;
		}
	}
}
