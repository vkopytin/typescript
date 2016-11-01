using System;
using System.Data.SQLite;

using Vko.Repository.Implementation;


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
			
            t = typeof(IOrderDetailsRepository<>).MakeGenericType(i);
            if (type == t)
            {
                Type f = typeof(OrderDetailsRepository<>).MakeGenericType(i);

                return (T)Activator.CreateInstance(f, connection);
            }

            t = typeof(IOrdersRepository<>).MakeGenericType(i);
            if (type == t)
            {
                Type f = typeof(OrdersRepository<>).MakeGenericType(i);

                return (T)Activator.CreateInstance(f, connection);
            }

            t = typeof(ISuppliersRepository<>).MakeGenericType(i);
            if (type == t)
            {
                Type f = typeof(SuppliersRepository<>).MakeGenericType(i);

                return (T)Activator.CreateInstance(f, connection);
            }

            throw new NotImplementedException(string.Format("Not found implementation for {0} type!!!", type.FullName));
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
	            if (this.connection != null)
	            {
	                this.connection.Dispose();
	                this.connection = null;
	            }
	        }
	        // free native resources if there are any.
	    }
	}
}