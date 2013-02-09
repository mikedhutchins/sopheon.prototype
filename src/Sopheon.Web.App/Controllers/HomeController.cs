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

        public ActionResult Nav(string path)
        {
            return View(path);
        }

	}
}
