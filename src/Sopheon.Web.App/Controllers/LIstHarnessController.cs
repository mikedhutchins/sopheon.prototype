using Sopheon.Domain.Entities;
using Sopheon.system.Processor;
using Sopheon.system.UX;
using Sopheon.system.Lists;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Sopheon.framework;
using Sopheon.Domain.Responses;
using Sopheon.Domain.Managers;
using Sopheon.Domain.Requests;
using Sopheon.system.UX;
using Sopheon.Domain.Entities.Filters;

namespace Sopheon.Web.App.Controllers
{
	public class DemoResponse : UiResponse
	{
		public DemoResponse()
		{
			Subject = new PagedList<ProcessTemplate>();
		}

		public PagedList<ProcessTemplate> Templates
		{
			get
			{
				return (PagedList<ProcessTemplate>)Subject;
			}
		}
	}

    public class LIstHarnessController : BaseController
    {
		List<ProcessTemplate> _templates = new List<ProcessTemplate>();
		private ProcessModelManager _manager;

		public LIstHarnessController(ProcessModelManager manager)
		{
			_manager = manager;
		}

		public ActionResult Index()
        {
            return View();
        }

		UiResponse GetPage(GatesListFilter filter)
		{
			var response = _manager.GetGatesPagedList(new GetGatesPagedListRequest { Filter = filter });

			return response.ToUi((r) => RenderPartialViewToString("ListOfGates", r.Templates.Items));
		}

		public ActionResult Page(GatesListFilter filter)
		{
			return Json(GetPage(filter), JsonRequestBehavior.AllowGet);
		}
    }
}
