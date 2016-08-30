using System;
using System.Data.SQLite;


namespace Vko.Repository
{
	class General: IDisposable
	{
		SQLiteConnection connection;
		
		public General()
		{
			this.connection = new SQLiteConnection(Config.DefaultDB);
			this.connection.Open();
		}
		
		public T Make<T>()
		{
			Type type = typeof(T);
            Type i = type.GetGenericArguments()[0];
			
            Type t = typeof(IProductsRepository<>).MakeGenericType(i);
            if (type == t)
            {
                Type f = typeof(ProductsRepository<>).MakeGenericType(i);

                return (T)Activator.CreateInstance(f, connection);
            }

            t = typeof(ICategoriesRepository<>).MakeGenericType(i);
            if (type == t)
            {
                Type f = typeof(CategoriesRepository<>).MakeGenericType(i);

                return (T)Activator.CreateInstance(f, connection);
            }
			
            throw new NotImplementedException(string.Format("Not found implementation for {0} type!!!", type.FullName));
		}
		
		public IRepository<T> Request<T>()
		{
			if (HasGenericInterface(typeof(SuppliersRepository), typeof(ISuppliersRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(SuppliersRepository), connection);
			}
			
			if (HasGenericInterface(typeof(OrdersRepository), typeof(IOrdersRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(OrdersRepository), connection);
			}
			
			if (HasGenericInterface(typeof(OrderDetailsRepository), typeof(IOrderDetailsRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(OrderDetailsRepository), connection);
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
		
		// Dispose() calls Dispose(true)
	    public void Dispose()
	    {
	        Dispose(true);
	        GC.SuppressFinalize(this);
	    }
	    // NOTE: Leave out the finalizer altogether if this class doesn't 
	    // own unmanaged resources itself, but leave the other methods
	    // exactly as they are. 
	    ~General() 
	    {
	        // Finalizer calls Dispose(false)
	        Dispose(false);
	    }
	    // The bulk of the clean-up code is implemented in Dispose(bool)
	    protected virtual void Dispose(bool disposing)
	    {
	        if (disposing) 
	        {
	            // free managed resources
	            if (connection != null)
	            {
	                connection.Dispose();
	                connection = null;
	            }
	        }
	        // free native resources if there are any.
	    }
	}
}