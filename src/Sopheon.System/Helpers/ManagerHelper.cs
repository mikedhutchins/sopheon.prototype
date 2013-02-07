using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StructureMap;
using System.Data.Objects;
using Sopheon.framework.Reflection;
using Sopheon.system.Processor;
using Sopheon.system.Validation;


namespace Sopheon.framework
{
	public static class ManagerHelper
	{
		public static RESPONSETYPE SimpleOperation<REQUESTTYPE, RESPONSETYPE, OPERATIONTYPE>(this ObjectContext context, REQUESTTYPE request, Func<object> getparamsF) where RESPONSETYPE : OperationResponse
		{
			RESPONSETYPE response = ObjectFactory.GetInstance<RESPONSETYPE>();

			OPERATIONTYPE operation = ObjectFactory.GetInstance<OPERATIONTYPE>((getparamsF()).ToParamsDictionary());

			response.Merge(request.Validate());

			if (response.State != ProcessorState.Exception || response.State != ProcessorState.Failed)
			{
				response.Merge(operation.Exec<RESPONSETYPE>("Execute", new object[] { context }));
			}
			return response;
		}
	}
}
