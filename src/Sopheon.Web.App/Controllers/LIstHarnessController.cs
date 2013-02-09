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

		public LIstHarnessController()
		{
			for (int i = 0; i < 1000; i++)
			{
				_templates.Add(new ProcessTemplate { Id = i, Name = "PT #{i}".SimpleBind(new { i = i }) });
			}
		}

		public ActionResult Index()
        {
            return View();
        }

		DemoResponse GetNextPage(PagedListFilteredBase filter)
		{
			var items = _templates.Skip(filter.CurrentIndex).Take(filter.PageSize).ToList();

			DemoResponse response = new DemoResponse();

			response.Templates.Items.AddRange(items);

			response.Templates.CurrentIndex = filter.CurrentIndex;

			response.Templates.PageSize = filter.PageSize;

			response.Templates.TotalRecords = _templates.Count;

			response.HtmlResult = RenderPartialViewToString("ListOfTemplates", items);

			return response;
		}

		public ActionResult Page(PagedListFilteredBase filter)
		{
			return Json(GetNextPage(filter), JsonRequestBehavior.AllowGet);
		}
    }
}
