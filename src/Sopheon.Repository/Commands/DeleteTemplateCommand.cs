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

namespace Sopheon.Repository.Commands
{
	public class DeleteTemplateCommand : IDeleteTemplateCommand
	{
		#region fields
		private GetTemplateForDeleteConfirmRequest _request;

		private SaveProcessTemplateResponse _response;

		private d.SopheonEntities _context;
		#endregion

		public DeleteTemplateCommand(GetTemplateForDeleteConfirmRequest request)
		{
			_request = request;

			_response = new SaveProcessTemplateResponse();
		}

		public OperationResponse Execute(ObjectContext context)
		{
			d.ProcessTemplate template = null;

			Processor processor = new Processor().SetResponse(_response)
			#region step #1 get context
			.Then((p) => { _context = (d.SopheonEntities)context; })
			#endregion

			#region step #2 get stuff
			.Then((p) =>
			{
				template = _context.ProcessTemplates.FirstOrDefault(x => x.Id.Equals(_request.TemplateId));

				p.Evaluate(!(template == null && _request.TemplateId > -1), "Template was not found.");
			})
			#endregion

			#region step 3#
			.Then((p) =>
			{
				_context.ProcessTemplates.DeleteObject(template);

				_context.SaveChanges();
			});
			#endregion

			return _response;
		}
	}
}
