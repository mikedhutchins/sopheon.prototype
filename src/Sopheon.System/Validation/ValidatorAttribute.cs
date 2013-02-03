using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Validation
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ValidatorAttribute : Attribute
    {
        public int Sequence { get; set; }

        public bool ShouldFail { get; set; }

        public string FailureMessage { get; set; }

        public string SuccessMessage { get; set; }
    }
}
