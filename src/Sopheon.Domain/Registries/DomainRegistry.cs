using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using StructureMap.Configuration.DSL;
using System.Data.Objects;
using Sopheon.system.Contracts;
using Sopheon.Domain;
using Sopheon.Domain.Contracts;
using Sopheon.system.Validation;

namespace Sopheon.Domain.Registries
{
	public class ValidationRegistry : Registry
	{
		public ValidationRegistry()
		{
            Scan(cfg =>
            {
				cfg.TheCallingAssembly();
				cfg.AddAllTypesOf(typeof(IValidator<>));
				cfg.WithDefaultConventions();


                cfg.ConnectImplementationsToTypesClosing(typeof(IValidator<>));
            });
        }
	}
}
