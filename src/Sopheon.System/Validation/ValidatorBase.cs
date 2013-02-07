using Sopheon.system.Processor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.framework.Reflection;
using p = Sopheon.system.Processor;
using Sopheon.system.Validation;
using Sopheon.framework;

namespace Sopheon.system.Validation
{
    public interface IValidator<SUBJECTTYPE>
    {
        OperationResponse Validate();

		OperationResponse Validate(ValidatorContexts contexts);

		SUBJECTTYPE Subject { get; set; }
    }

    public abstract class ValidatorBase<SUBJECTTYPE> : IValidator<SUBJECTTYPE>
    {
        public SUBJECTTYPE Subject { get; set; }

		public OperationResponse Validate()
		{
			return Validate(ValidatorContexts.All);
		}

		public OperationResponse Validate(ValidatorContexts contexts)
        {
            p.Processor proc = new p.Processor()
            {
                ContinueOnFailure = true
            };

            this.GetType().GetMethods()
                .Where(meth => meth.HasAttribute<ValidatorAttribute>() &&
					(meth.GetAttribute<ValidatorAttribute>().Context.HasFlag(ValidatorContexts.All)
					|| meth.GetAttribute<ValidatorAttribute>().Context.ContainsMatch(contexts)))
                .OrderBy(meth => meth.GetAttribute<ValidatorAttribute>().Sequence)
                .ToList().ForEach(meth =>
                {
                    var attribute = meth.GetAttribute<ValidatorAttribute>();
                    proc.Then((p) =>
                    {
                        meth.Invoke(this, new object [] { p });

                        if (proc.Response.State == ProcessorState.Failed && attribute.ShouldFail)
                        {
                            proc.ContinueOnFailure = false;
                        }
                    });
                });

            return proc.Response;
        }
    }
}
