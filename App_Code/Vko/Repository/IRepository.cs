using System.Collections.Specialized;
using System.Collections.Generic;

namespace Vko.Repository
{
	public interface IRepository<T>
	{
		T GetById(object id);
		
		IEnumerable<T> List();
		IEnumerable<T> Find<Y>(Y args);
		
		T Update(T product);
		
		T Create(T product);
	}
}