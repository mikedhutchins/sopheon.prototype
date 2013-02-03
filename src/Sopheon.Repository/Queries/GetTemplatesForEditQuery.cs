using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Sopheon.Domain.Contracts;
using Sopheon.system.Processor;
using System.Data.Objects;
using Sopheon.Domain.Requests;
using Sopheon.Domain.Responses;
using d = Sopheon.Data;
using Sopheon.Repository.Mappings;

namespace Sopheon.Repository.Queries
{
    public class GetTemplatesForEditQuery : IGetTemplatesForEditQuery
    {
        #region fields
        private GetTemplatesForEditRequest _request;

        private GetTemplatesForEditResponse _response;

        private d.SopheonEntities _context;
        #endregion

        public GetTemplatesForEditQuery(GetTemplatesForEditRequest request)
        {
            _request = request;

            _response = new GetTemplatesForEditResponse();
        }

        public OperationResponse Execute(ObjectContext context)
        {

            Processor processor = new Processor().SetResponse(_response)
            #region step #1 get context
            .Then((p) => { _context = (d.SopheonEntities)context; })
            #endregion

            #region step #2 get stuff
            .Then((p) =>
            {
                var templates = _context.ProcessTemplates.ToArray().Select(x => x.ToDomainModel()).ToList();

                _response.Subject = templates;
            })
            #endregion
            ;

            return _response;
        }
    }
}
