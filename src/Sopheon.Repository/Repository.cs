using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Objects;
using Sopheon.system.Contracts;
using Sopheon.framework.Response;
using Sopheon.framework.Repository;

namespace Sopheon.Repository
{
	public class Repository : IRepository
	{
		public ObjectContext Context{ get; set; }

		public Repository(ObjectContext context)
		{
			Context = context;
		}

		public IResponse<T> Execute<T>(ICommand<T> command)
		{
			return (IResponse<T>)command.Execute(Context);
		}

		public IResponse<T> Execute<T>(IQuery query)
		{
			return (IResponse<T>)query.Execute(Context);
		}
	}
}
