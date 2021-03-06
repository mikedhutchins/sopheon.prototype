﻿using Sopheon.system.Processor;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Validation
{
    public static class ValidationHelper
    {

		public static OperationResponse Validate<SUBJECTTYPE>(this SUBJECTTYPE subject, ValidatorContexts contexts)
		{
			var instances = ObjectFactory.GetAllInstances<IValidator<SUBJECTTYPE>>();

			OperationResponse response = new OperationResponse();

			foreach (var validator in instances)
			{
				validator.Subject = subject;

				if (response.State == ProcessorState.Exception) break;

				response.Merge(validator.Validate(contexts));
			}

			return response;
		}
        public static OperationResponse Validate<SUBJECTTYPE>(this SUBJECTTYPE subject)
        {
			return subject.Validate(ValidatorContexts.All);
        }
    }
}
