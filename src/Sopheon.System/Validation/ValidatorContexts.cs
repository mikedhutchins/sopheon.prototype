using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Validation
{
	[Flags]
	public enum ValidatorContexts
	{
		Natural = 1, All = 2, Web = 4, Domain = 8, Repository = 16
	}
}
