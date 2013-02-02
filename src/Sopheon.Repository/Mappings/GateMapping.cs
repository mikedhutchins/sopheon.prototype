using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using d = Sopheon.Domain.Entities;
using Sopheon.Data;

namespace Sopheon.Repository.Mappings
{
	public static class GateMapping
	{
		public static d.Gate ToDomainModel(this Gate data)
		{
			if (data == null) return null;

			return new d.Gate {
				Id = data.Id,

				Name = data.Name,

				ScheduledCompletion = data.ScheduledCompletion,
			};
		}
	}
}
