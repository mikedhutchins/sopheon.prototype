using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using StructureMap.Configuration.DSL;
using System.Data.Objects;
using Sopheon.system.Contracts;
using Sopheon.Repository;
using Sopheon.Domain;
using Sopheon.Repository.Queries;
using Sopheon.Domain.Contracts;
using Sopheon.Repository.Commands;

namespace Sopheon.Repository.Registries
{
	public class RepositoryRegistry : Registry
	{
		public RepositoryRegistry()
		{
			For<IRepository>() .Use((x) => {
				var context = new Sopheon.Data.SopheonEntities(ConfigurationManager.ConnectionStrings["SopheonEntities"].ConnectionString);

					return new Repository((ObjectContext)context);
				});

			For<IGetMyProcessTemplatesQuery>().Use<GetMyProcessTemplatesQuery>();

			For<IGetMyProjectsByTemplateIdQuery>().Use<GetMyProjectsByTemplateIdQuery>();

			For<IGetMyGatesByTemplateIdQuery>().Use<GetMyGatesByTemplateQuery>();

			For<IGetTemplateForEditQuery>().Use<GetTemplateForEditQuery>();

            For<IGetTemplatesForEditQuery>().Use<GetTemplatesForEditQuery>();

            For<ISaveProcessTemplateCommand>().Use<SaveProcessTemplateCommand>();
        }
	}
}
