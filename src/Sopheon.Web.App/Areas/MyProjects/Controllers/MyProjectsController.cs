using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Sopheon.Domain.Managers;
using StructureMap;
using Sopheon.Domain.Requests;
using Sopheon.Domain.Responses;
using Sopheon.system.UX;
using Sopheon.system.Processor;

namespace Sopheon.Web.App.Areas.MyProjects.Controllers
{
    public class MyProjectsController : BaseController
    {
		private MyProjectsManager _myProjectsManager;
		public MyProjectsController()
		{
			_myProjectsManager = ObjectFactory.GetInstance<MyProjectsManager>();
		}

		public MyProjectsController(MyProjectsManager myProjectsManager)
		{
			_myProjectsManager = myProjectsManager;
		}

		public ActionResult ProjectByTemplate(int templateId)
		{
			var uiresponse = _myProjectsManager.GetMyProjectsByTemplateId(new GetMyProjectsByTemplateIdRequest { TemplateId = templateId })
				.ToUi((response) => 
					response.State == ProcessorState.Succeeded 
						? RenderPartialViewToString("ProjectList", response.Projects) 
						: RenderPartialViewToString(VIEW_ERROR, response)); 

			return Json(uiresponse, JsonRequestBehavior.AllowGet);
		}

		public ActionResult GatesByProject(int projectId)
		{
			var uiresponse = _myProjectsManager.GetMyGatesByProject(new GetGatesByProjectIdRequest { ProjectId = projectId })
				.ToUi((response) =>
					response.State == ProcessorState.Succeeded
						? RenderPartialViewToString("GateList", response.Gates)
						: RenderPartialViewToString(VIEW_ERROR, response));

			return Json(uiresponse, JsonRequestBehavior.AllowGet);
		}

        public ActionResult Index()
        {
			var response = _myProjectsManager.GetMyProcessTemplates(new GetMyProcessTemplatesRequest { })
                .ToUi((r) => RenderPartialViewToString("Index", r));

            return Json(response, JsonRequestBehavior.AllowGet);
        }

    }
}
