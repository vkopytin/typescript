using System.Collections.Specialized;
using System.Collections.Generic;

namespace Rebelmouse.jira.Repository
{
	public interface IRepository<T>
	{
		IEnumerable<T> Find<Y>(Y args);
		IEnumerable<T> Find(Statement filter);
		IEnumerable<T> Find();
	}
}