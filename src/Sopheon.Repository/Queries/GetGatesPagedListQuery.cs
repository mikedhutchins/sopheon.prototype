using Sopheon.Domain.Contracts;
using Sopheon.Domain.Requests;
using Sopheon.Domain.Responses;
using Sopheon.system.Processor;
using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Linq;
using System.Text;
using d = Sopheon.Data;
using Sopheon.Repository.Mappings;
using Sopheon.system.Lists;

namespace Sopheon.Repository.Queries
{
	public class GetGatesPagedListQuery : IGetGatesPagedListQuery
	{
		#region definitions
		d.SopheonEntities _context;

		private GetGatesPagedListRequest  _request;

		private GetGatesPagedListResponse _response;
		#endregion

		#region cstr
		public GetGatesPagedListQuery(GetGatesPagedListRequest request)
		{
			_request = request;

			_response = new GetGatesPagedListResponse();
		}
		#endregion

		public OperationResponse Execute(ObjectContext context)
		{
			Processor processor = new Processor().SetResponse(_response)
				#region step #1 get context
				.Then((p) => { _context = (d.SopheonEntities)context; })
				#endregion

				#region step #2 get the rows
				.Then((p) => {
					var items = _context.Gates.OrderBy(x => x.Id).Skip(_request.Filter.CurrentIndex).Take(_request.Filter.PageSize).ToArray()
						.Select(temp => temp.ToDomainModel()).ToList();

					var count = _context.Gates.Count();

					var list = (new PagedList<Domain.Entities.Gate> {
						Items = items,
					}).Merge(_request.Filter);

					list.TotalRecords = count;

					_response.Subject = list;

				})
				#endregion
				;

			return _response;
		}
	}
}


