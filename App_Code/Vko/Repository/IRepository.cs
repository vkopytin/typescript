using System.Collections.Specialized;
using System.Collections.Generic;

namespace Vko.Repository {
	public interface IRepository<T> {
		IEnumerable<T> Find<Y>(Y args);
		IEnumerable<T> Find();
	}
}