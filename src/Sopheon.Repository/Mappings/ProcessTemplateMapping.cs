using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using d = Sopheon.Domain.Entities;
using Sopheon.Data;

namespace Sopheon.Repository.Mappings
{
	public static class ProcessTemplateMapping
	{
		public static d.ProcessTemplate ToDomainModel(this ProcessTemplate data)
		{
			if (data == null) return null;

			return new d.ProcessTemplate {
				Id = data.Id,

				Name = data.Name,

                ProjectCount = data.Projects.Count(),
			};
		}

		public static ProcessTemplate ToDataModel(this d.ProcessTemplate dom)
		{
			if (dom == null) return null;

			return new ProcessTemplate
			{
				Id = dom.Id,

				Name = dom.Name,
			};
		}

		public static void ForUpdate(this ProcessTemplate dest, ProcessTemplate update)
		{
			dest.Name = update.Name;
		}
	}
}
