using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.framework.Response
{
	public interface IResponse<RESPONSETYPE>
	{
		RESPONSETYPE Subject { get;set; }
	}
}
