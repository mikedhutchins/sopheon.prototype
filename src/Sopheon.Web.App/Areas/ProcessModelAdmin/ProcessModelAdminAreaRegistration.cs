using System.Web.Mvc;

namespace Sopheon.Web.App.Areas.ProcessModelAdmin
{
	public class ProcessModelAdminAreaRegistration : AreaRegistration
	{
		public override string AreaName
		{
			get
			{
				return "ProcessModelAdmin";
			}
		}

		public override void RegisterArea(AreaRegistrationContext context)
		{
			context.MapRoute("ProcessModelAdmin_default", "ProcessModelAdmin", new { controller = "ProcessModelAdminController", action = "Index" });

			context.MapRoute("ProcessModelAdmin_edit_template", "ProcessModelAdmin/Template/Edit", new { controller = "ProcessModelAdminController", action = "Edit" });
		}
	}
}
