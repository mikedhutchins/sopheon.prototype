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
using Sopheon.Domain.Entities;

namespace Sopheon.Web.App.Areas.ProcessModelAdmin.Controllers
{
    public class ProcessModelAdminController : BaseController
	{
		#region fields
		private ProcessModelManager _processModelManager;
		#endregion

		#region cstor
		public ProcessModelAdminController(ProcessModelManager processModelManager)
		{
			_processModelManager = processModelManager;
		}
		#endregion

		#region OPERATIONS posts / updates and what not
		ActionResult ProcessSaveOperation(Func<SaveProcessTemplateResponse> responseF)
		{
			SaveProcessTemplateResponse response = responseF();

			var uiResponse = response.ToUi((r) =>
				RenderPartialViewToString("ListProcessTemplates", _processModelManager.GetTemplatesForEdit(new GetTemplatesForEditRequest { }).Merge(r).Subject)
			);

			return Json(uiResponse, JsonRequestBehavior.AllowGet);
		}

		[HttpPost]
        public ActionResult SaveModel(ProcessTemplate template)
        {
			return ProcessSaveOperation(() => _processModelManager.SaveProcessTemplate(new SaveProcessTemplateRequest { Template = template }));
        }

		[HttpPost]
		public ActionResult Delete(int templateId)
		{
			return ProcessSaveOperation(() => _processModelManager.DeleteTemplate(new GetTemplateForDeleteConfirmRequest { TemplateId = templateId }));
		}
		#endregion

		#region OPERATIONS
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
						? RenderPartialViewToString("EditTemplate", response)
						: RenderPartialViewToString(VIEW_ERROR, response));

			return Json(uiresponse, JsonRequestBehavior.AllowGet);
		}

		public ActionResult DeleteConfirm(int templateId)
		{
			var uiresponse = _processModelManager.GetTemplateForDeleteConfirm(new GetTemplateForDeleteConfirmRequest { TemplateId = templateId })
				.ToUi((response) =>
					response.State == ProcessorState.Succeeded
						? RenderPartialViewToString("DeleteConfirm", response)
						: RenderPartialViewToString(VIEW_ERROR, response));

			return Json(uiresponse, JsonRequestBehavior.AllowGet);
		}
		#endregion
	}
}
