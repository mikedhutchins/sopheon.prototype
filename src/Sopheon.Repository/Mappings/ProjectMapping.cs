using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using d = Sopheon.Domain.Entities;
using Sopheon.Data;

namespace Sopheon.Repository.Mappings
{
	public static class ProjectMapping
	{
		public static d.Project ToDomainModel(this Project data)
		{
			if (data == null) return null;

			return new d.Project {
				Id = data.Id,

				Name = data.Name,

				TemplateId = data.TemplateId,
			};
		}
	}
}
