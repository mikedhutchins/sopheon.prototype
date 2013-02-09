using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;

namespace Sopheon.Web.App
{
	public class RouteConfig
	{
		public static void	RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(name: "Default",url: "",defaults: new { controller = "Home", action = "Index" });

            routes.MapRoute(name: "navloader", url: "nav", defaults: new { controller = "Home", action = "Nav" });

			routes.MapRoute(name: "listharness_index", url: "lists", defaults: new { controller = "ListHarness", action = "Index" });

			routes.MapRoute(name: "listharness_deferred", url: "lists/deferred", defaults: new { controller = "ListHarness", action = "Page" });

			routes.MapRoute(name: "listharness_lazy", url: "lists/lazy", defaults: new { controller = "ListHarness", action = "Page" });
		}
	}
}