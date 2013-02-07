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
			context.MapRoute("ProcessModelAdmin_default", "ProcessModelAdmin", new { controller = "ProcessModelAdmin", action = "Index" });

			context.MapRoute("ProcessModelAdmin_edit_template", "ProcessModelAdmin/Template/Edit", new { controller = "ProcessModelAdmin", action = "Edit" });

            context.MapRoute("ProcessModelAdmin_save_template", "ProcessModelAdmin/Template/Save", new { controller = "ProcessModelAdmin", action = "SaveModel" });

			context.MapRoute("ProcessModelAdmin_delete_confirm_template", "ProcessModelAdmin/Template/DeleteConfirm", new { controller = "ProcessModelAdmin", action = "DeleteConfirm" });

			context.MapRoute("ProcessModelAdmin_delete_template", "ProcessModelAdmin/Template/Delete", new { controller = "ProcessModelAdmin", action = "Delete" });

            context.MapRoute("ProcessModelAdmin_processmodels", "ProcessModelAdmin/ProcessModels", new { controller = "ProcessModelAdmin", action = "ModelList" });

            context.MapRoute("ProcessModelAdmin_metrics", "ProcessModelAdmin/Metrics", new { controller = "ProcessModelAdmin", action = "MetricList" });
        }
	}
}
