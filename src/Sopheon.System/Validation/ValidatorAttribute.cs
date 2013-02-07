using Sopheon.system.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Validation
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ValidatorAttribute : Attribute
    {
		public ValidatorAttribute()
		{
			Context = ValidatorContexts.All;
		}

        public int Sequence { get; set; }

        public bool ShouldFail { get; set; }

		public ValidatorContexts Context { get; set; }
    }
}
