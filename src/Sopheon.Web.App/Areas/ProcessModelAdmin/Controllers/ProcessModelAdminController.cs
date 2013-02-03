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

namespace Sopheon.Web.App.Areas.ProcessModelAdmin.Controllers
{
    public class ProcessModelAdminController : BaseController
	{

		#region fields
		private ProcessModelManager _processModelManager;
		#endregion

		public ProcessModelAdminController(ProcessModelManager processModelManager)
		{
			_processModelManager = processModelManager;
		}

        public ActionResult ModelList()
        {
            var response = _processModelManager.GetTemplatesForEdit(new GetTemplatesForEditRequest { })
                .ToUi((r) => RenderPartialViewToString("Index", r));

            return Json(response, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Index()
        {
            var response = _processModelManager.GetTemplatesForEdit(new GetTemplatesForEditRequest { });

            return View(response);
        }

        public ActionResult MetricList()
        {
            var response = new OperationResponse()
                .ToUi((r) => RenderPartialViewToString("MetricList", r));

            return Json(response, JsonRequestBehavior.AllowGet);
        }

		public ActionResult Edit(int templateId)
		{
			var uiresponse = _processModelManager.GetTemplateForEdit(new GetTemplateForEditRequest { TemplateId = templateId })
				.ToUi((response) =>
					response.State == ProcessorState.Succeeded
						? RenderPartialViewToString("EditTemplate", response.Template)
						: RenderPartialViewToString(VIEW_ERROR, response));

			return Json(uiresponse, JsonRequestBehavior.AllowGet);

		}
    }
}
