using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Objects;
using Sopheon.framework.Response;

namespace Sopheon.framework.Repository
{
	public interface ICommand<RESULTT>
	{
		IResponse<RESULTT> Execute(ObjectContext context);
	}
}
