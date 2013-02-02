using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Contracts
{
	public interface IRepository
	{
		global::System.Data.Objects.ObjectContext Context { get; set; }
	}
}
