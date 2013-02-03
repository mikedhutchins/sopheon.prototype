using Sopheon.system.Processor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.framework.Reflection;
using p = Sopheon.system.Processor;

namespace Sopheon.system.Validation
{
    public interface IValidator<SUBJECTTYPE>
    {
        OperationResponse Validate();

        SUBJECTTYPE Subject { get; set; }
    }

    public abstract class ValidatorBase<SUBJECTTYPE> : IValidator<SUBJECTTYPE>
    {
        public SUBJECTTYPE Subject { get; set; }

        public OperationResponse Validate()
        {
            p.Processor proc = new p.Processor()
            {
                ContinueOnFailure = true
            };

            this.GetType().GetMethods()
                .Where(meth => meth.HasAttribute<ValidatorAttribute>())
                .OrderBy(meth => meth.GetAttribute<ValidatorAttribute>().Sequence)
                .ToList().ForEach(meth =>
                {
                    var attribute = meth.GetAttribute<ValidatorAttribute>();
                    proc.Then((p) =>
                    {
                        meth.Invoke(Subject, new object[] { proc });

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
