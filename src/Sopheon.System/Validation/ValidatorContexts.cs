using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Validation
{
	[Flags]
	public enum ValidatorContexts
	{
		All = 8, Web = 1, Domain = 2, Repository = 4
	}
}
