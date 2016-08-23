using System;


namespace Vko.Repository
{
	class General
	{
		public General()
		{
			
		}
		
		public static IRepository<T> Request<T>()
		{
			if (HasGenericInterface(typeof(ProductsRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(ProductsRepository));
			}
			
			if (HasGenericInterface(typeof(SuppliersRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(SuppliersRepository));
			}
			
			if (HasGenericInterface(typeof(CategoriesRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(CategoriesRepository));
			}
			
			if (HasGenericInterface(typeof(OrdersRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(OrdersRepository));
			}
			
			if (HasGenericInterface(typeof(OrderDetailsRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(OrderDetailsRepository));
			}
			
			throw new Exception(string.Format("There is no defined class that implements {0}", typeof(IRepository<T>).ToString()));
		}
		
		public static bool HasGenericInterface(Type type, Type interf, Type typeparameter)
	    {
	        foreach (Type i in type.GetInterfaces())
			{
	            if (i.IsGenericType && i.GetGenericTypeDefinition() == interf)
				{
	                if (i.GetGenericArguments()[0] == typeparameter)
					{
	                    return true;
					}
				}
			}
	
	        return false;
	    }
	}
}