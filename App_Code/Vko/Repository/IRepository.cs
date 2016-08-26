using System.Collections.Specialized;
using System.Collections.Generic;

namespace Vko.Repository
{
	public interface IRepository<T>
	{
		T GetById(object id);
		
		IEnumerable<T> List(int from, int count);
		IEnumerable<T> Find<Y>(Y args);
		
		T Update(T product);
		
		T Create(T product);
		
		int GetCount();
		
		int RemoveById(object id);
	}
}