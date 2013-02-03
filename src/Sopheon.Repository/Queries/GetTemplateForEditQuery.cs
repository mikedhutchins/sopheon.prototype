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
			d.ProcessTemplate template = null;

			Processor processor = new Processor().SetResponse(_response)
			#region step #1 get context
			.Then((p) => { _context = (d.SopheonEntities)context; })
			#endregion

			#region step #2 get stuff
			.Then((p) => {
				template = _context.ProcessTemplates.FirstOrDefault(x => x.Id.Equals(_request.TemplateId) || (_request.TemplateId <= 0 && x.Name.Equals(_request.Name)));
				
				p.Evaluate(!(template == null && _request.TemplateId > -1), "Model was not found!");
			})
			#endregion

			#region step #3
			.Then((p) => {
				_response.Subject = template == null ? new Domain.Entities.ProcessTemplate { Id = -1, Name = string.Empty, ProjectCount = 0 } : template.ToDomainModel();
			})
			#endregion
			;

			return _response;
		}
	}
}
