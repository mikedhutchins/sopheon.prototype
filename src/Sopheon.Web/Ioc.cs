using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StructureMap;

namespace Sopheon.Web
{
	public static class IoC
	{
		public static IContainer Initialize()
		{
			ObjectFactory.Initialize(x => {
				x.Scan(scan => {
					scan.Assembly("Sopheon.Data");

					scan.Assembly("Sopheon.Repository");

					scan.Assembly("Sopheon.Domain");

					scan.Assembly("Sopheon.System");

					scan.Assembly("Sopheon.Web");

					scan.TheCallingAssembly();

					scan.WithDefaultConventions();

					scan.LookForRegistries();
				});
			});

			return ObjectFactory.Container;
		}
	}
}