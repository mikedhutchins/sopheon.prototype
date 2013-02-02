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
	public class GetMyProjectsByTemplateIdQuery : IGetMyProjectsByTemplateIdQuery
	{
		#region definitions
		d.SopheonEntities _context;

		private GetMyProjectsByTemplateIdRequest _request;

		private GetMyProjectsByTemplateIdResponse _response;
		#endregion

		#region cstr
		public GetMyProjectsByTemplateIdQuery(GetMyProjectsByTemplateIdRequest request)
		{
			_request = request;

			_response = new GetMyProjectsByTemplateIdResponse();
		}
		#endregion

		public OperationResponse Execute(ObjectContext context)
		{
			Processor processor = new Processor().SetResponse(_response)
				#region step #1 get context
				.Then((p) => { _context = (d.SopheonEntities)context; })
				#endregion

				#region step #2 get game
				.Then((p) => {
					_response.Subject = _context.Projects.Where(x => x.TemplateId.Equals(_request.TemplateId)).ToArray()
						.Select(x => x.ToDomainModel())
						.ToList();
				})
				#endregion
				;

			return _response;
		}
	}
}
