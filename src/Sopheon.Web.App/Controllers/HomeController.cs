using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Sopheon.Domain.Managers;

namespace Sopheon.Web.App.Controllers
{
	public class HomeController : BaseController
	{
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult About()
		{
			ViewBag.Message = "Your app description page.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "Your contact page.";

			return View();
		}
	}
}
