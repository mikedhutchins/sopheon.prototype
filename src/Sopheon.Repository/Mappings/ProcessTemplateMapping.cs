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
	}
}
