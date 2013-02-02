using System.Web.Mvc;

namespace Sopheon.Web.App.Areas.MyProjects
{
	public class MyProjectsAreaRegistration : AreaRegistration
	{
		public override string AreaName
		{
			get
			{
				return "MyProjects";
			}
		}

		public override void RegisterArea(AreaRegistrationContext context)
		{

			context.MapRoute("MyProjects_home", "MyProjects", new { controller = "MyProjects", action = "Index" });

			context.MapRoute("MyProjects_ProjectsByTemplate", "MyProjects/ProjectByTemplate", new { controller = "MyProjects", action = "ProjectByTemplate" });

			context.MapRoute("MyProjects_GatesByProject", "MyProjects/GatesByProject", new { controller = "MyProjects", action = "GatesByProject" });

		}
	}
}
