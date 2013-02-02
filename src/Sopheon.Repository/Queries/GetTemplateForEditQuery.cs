using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.Domain.Contracts;
using Sopheon.system.Processor;
using System.Data.Objects;
using Sopheon.Domain.Requests;
using Sopheon.Domain.Responses;
using d = Sopheon.Data;
using Sopheon.Repository.Mappings;

namespace Sopheon.Repository.Queries
{
	public class GetTemplateForEditQuery : IGetTemplateForEditQuery
	{
		#region fields
		private GetTemplateForEditRequest _request;

		private GetTemplateForEditResponse _response;

		private d.SopheonEntities _context;
		#endregion

		public GetTemplateForEditQuery(GetTemplateForEditRequest request)
		{
			_request = request;

			_response = new GetTemplateForEditResponse();
		}

		public OperationResponse Execute(ObjectContext context)
		{

			Processor processor = new Processor().SetResponse(_response)
			#region step #1 get context
			.Then((p) => { _context = (d.SopheonEntities)context; })
			#endregion

			#region step #2 get stuff
			.Then((p) => {
				var template = _context.ProcessTemplates.FirstOrDefault(x => x.Id.Equals(_request.TemplateId));
				
				p.Evaluate(template != null);

				_response.Subject = template.ToDomainModel();
			})
			#endregion
			;

			return _response;
		}
	}
}
