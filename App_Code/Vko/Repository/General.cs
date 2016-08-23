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
		
		public IRepository<T> Request<T>()
		{
			if (HasGenericInterface(typeof(ProductsRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(ProductsRepository), this.connection);
			}
			
			if (HasGenericInterface(typeof(SuppliersRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(SuppliersRepository), this.connection);
			}
			
			if (HasGenericInterface(typeof(CategoriesRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(CategoriesRepository), this.connection);
			}
			
			if (HasGenericInterface(typeof(OrdersRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(OrdersRepository), this.connection);
			}
			
			if (HasGenericInterface(typeof(OrderDetailsRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(OrderDetailsRepository), this.connection);
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