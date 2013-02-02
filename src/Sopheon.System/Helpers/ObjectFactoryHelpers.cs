using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StructureMap.Pipeline;

namespace Sopheon.framework
{
	public static class ObjectFactoryHelpers
	{
		public static ExplicitArguments ToParamsDictionary(this object subject)
		{
			Dictionary<string, object> vals = new Dictionary<string, object>();

			subject.GetType().GetProperties().ToList().ForEach(p =>
				{
					vals.Add(p.Name, p.GetValue(subject, new object[] { }));
				});

			return new ExplicitArguments(vals);
		}

	}
}
