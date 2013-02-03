using Sopheon.Domain.Entities;
using Sopheon.system.Processor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.Domain.Responses
{
    public class GetTemplatesForEditResponse : OperationResponse
    {
        public List<ProcessTemplate> Templates
        {
            get
            {
                return (List<ProcessTemplate>)Subject;
            }
        }
    }
}
