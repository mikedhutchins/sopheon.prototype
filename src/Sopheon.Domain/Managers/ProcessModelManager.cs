using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Objects;
using Sopheon.system.Contracts;
using Sopheon.framework;
using Sopheon.Domain.Requests;
using Sopheon.Domain.Responses;
using Sopheon.Domain.Contracts;

namespace Sopheon.Domain.Managers
{
	public class ProcessModelManager
	{
		readonly IRepository _repository;

		readonly ObjectContext _context;

		public ProcessModelManager(IRepository repository)
		{
			_repository = repository;

			_context = _repository.Context;
		}

		public Responses.GetTemplateForEditResponse GetTemplateForEdit(Requests.GetTemplateForEditRequest request)
		{
			return _context.SimpleOperation<GetTemplateForEditRequest, GetTemplateForEditResponse, IGetTemplateForEditQuery>(request, () => new { request = request });
		}
	}
}
