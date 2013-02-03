using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Objects;
using Sopheon.framework.Response;
using Sopheon.system.Processor;

namespace Sopheon.framework.Repository
{
	public interface ICommand
	{
        OperationResponse Execute(ObjectContext context);
    }
}
