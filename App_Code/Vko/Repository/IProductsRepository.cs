using System;
using System.Collections.Specialized;
using System.Collections.Generic;


namespace Vko.Repository
{
	interface IProductsRepository<T>
	{
		T GetById(object id);
		
		IEnumerable<T> List(int from, int count);
		IEnumerable<T> Find<Y>(Y args);
		
		T Update(object id, T product);
		
		T Create(T product);
		
		int GetCount();
		
		int RemoveById(object id);
	}
}