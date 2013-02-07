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
using Sopheon.system.Validation;
using Sopheon.system.Processor;
using Sopheon.system.Validation;
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

		public Responses.GetTemplateForEditResponse GetTemplateForDeleteConfirm(Requests.GetTemplateForDeleteConfirmRequest request)
		{
			return _context.SimpleOperation<GetTemplateForDeleteConfirmRequest, GetTemplateForEditResponse, IGetTemplateForEditQuery>(request, () => new { request = request });
		}
		
		public GetTemplatesForEditResponse GetTemplatesForEdit(GetTemplatesForEditRequest request)
        {
            return _context.SimpleOperation<GetTemplatesForEditRequest, GetTemplatesForEditResponse, IGetTemplatesForEditQuery>(request, () => new { request = request });
        }

        public SaveProcessTemplateResponse SaveProcessTemplate(SaveProcessTemplateRequest request)
        {
			return _context.SimpleOperation<SaveProcessTemplateRequest, SaveProcessTemplateResponse, ISaveProcessTemplateCommand>(request, () => new { request = request });
        }

		public SaveProcessTemplateResponse DeleteTemplate(GetTemplateForDeleteConfirmRequest request)
		{
			var response = _context.SimpleOperation<GetTemplateForDeleteConfirmRequest, SaveProcessTemplateResponse, IDeleteTemplateCommand>(request, () => new { request = request });

			if (response.State == ProcessorState.Succeeded)
			{
				response.Messages.Add(new OperationMessage { Message = "Delete succeeded." });
			}

			return response;
		}
	}
}
