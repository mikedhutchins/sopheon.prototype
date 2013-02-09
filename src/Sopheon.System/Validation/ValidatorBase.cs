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
			return Validate(ValidatorContexts.Natural);
		}

		public OperationResponse Validate(ValidatorContexts contexts)
        {
            p.Processor proc = new p.Processor()
            {
                ContinueOnFailure = true
            };

            this.GetType().GetMethods()
                .Where(meth => meth.HasAttribute<ValidatorAttribute>() && //  only methods with validator
					((meth.GetAttribute<ValidatorAttribute>().Context.HasFlag(ValidatorContexts.All) && contexts.HasFlag(ValidatorContexts.All)) // if the 
					|| (meth.GetAttribute<ValidatorAttribute>().Context.ContainsMatch(contexts) && 
							contexts.ContainsMatch(meth.GetAttribute<ValidatorAttribute>().Context))))
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
