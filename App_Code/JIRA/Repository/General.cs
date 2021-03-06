using System;

namespace Rebelmouse.jira.Repository {
	class General {
		public static IRepository<T> Request<T>() {
			if (HasGenericInterface(typeof(IssuesRepository), typeof(IRepository<>), typeof(T))) {
				return (IRepository<T>)Activator.CreateInstance(typeof(IssuesRepository));
			}
			
			throw new Exception(string.Format("There is no defined class that implements {0}", typeof(IRepository<T>).ToString()));
		}
		
		public static bool HasGenericInterface(Type type, Type interf, Type typeparameter)
	    {
	        foreach (Type i in type.GetInterfaces())
	            if (i.IsGenericType && i.GetGenericTypeDefinition() == interf)
	                if (i.GetGenericArguments()[0] == typeparameter)
	                    return true;
	
	        return false;
	    }
	}
}