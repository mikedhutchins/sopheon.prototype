using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.system.Contracts;
using System.Data.Objects;
using Sopheon.Domain.Responses;
using Sopheon.Domain.Requests;
using Sopheon.framework;
using Sopheon.Domain.Contracts;

namespace Sopheon.Domain.Managers
{
	public class MyProjectsManager
	{
		readonly IRepository _repository;

		readonly ObjectContext _context;

		public MyProjectsManager(IRepository repository)
		{
			_repository = repository;

			_context = _repository.Context;
		}

		public GetMyProcessTemplatesResponse GetMyProcessTemplates(GetMyProcessTemplatesRequest request)
		{
			return _context.SimpleOperation<GetMyProcessTemplatesRequest, GetMyProcessTemplatesResponse, IGetMyProcessTemplatesQuery>(request, () => new { request = request });
		}

		public GetMyProjectsByTemplateIdResponse GetMyProjectsByTemplateId(GetMyProjectsByTemplateIdRequest request)
		{
			return _context.SimpleOperation<GetMyProjectsByTemplateIdRequest, GetMyProjectsByTemplateIdResponse, IGetMyProjectsByTemplateIdQuery>(request, () => new { request = request });
		}

		public GetGatesByProjectResponse GetMyGatesByProject(GetGatesByProjectIdRequest request)
		{
			return _context.SimpleOperation<GetGatesByProjectIdRequest, GetGatesByProjectResponse, IGetMyGatesByTemplateIdQuery>(request, () => new { request = request });
		}
	}
}
