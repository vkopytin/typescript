using System;
using System.Collections.Generic;
using System.Linq;

using System.Data.SQLite;


namespace Vko.Repository
{
	class DataQuery<T>
	{
		SQLiteConnection conn;
		
		public DataQuery(SQLiteConnection connection)
		{
			conn = connection;
		}
        
        public object Scalar<Y>(string strSql, Y args)
        {
            var argsInfoCollection = typeof(Y).GetProperties();

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                foreach (var pInfo in argsInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(args));
                }

                return command.ExecuteScalar();
            }
        }
        
        public T SingleResult<Y>(string strSql, Y args)
        {
            var argsInfoCollection = typeof(Y).GetProperties();

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                foreach (var pInfo in argsInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(args));
                }

                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    var pInfoCollection = typeof(T).GetProperties()
                        .Where(x => reader.GetOrdinal(x.Name) != -1)
                        .ToList();
                        
                    while (reader.Read())
                    {
                        var inst = Activator.CreateInstance<T>();
                        
                        foreach (var pInfo in pInfoCollection)
                        {
                            object value = Convert.ChangeType(reader[pInfo.Name], pInfo.PropertyType);
                            pInfo.SetValue(inst, value, new object[] { });
                        }
                                
                        return inst;
                    }
                }
            }
            
            return default(T);
        }
		
		public IEnumerable<T> Run<Y>(string strSql, Y args)
		{
            var argsInfoCollection = typeof(Y).GetProperties();

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                foreach (var pInfo in argsInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(args));
                }
                
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    var pInfoCollection = typeof(T).GetProperties()
                        .Where(x => reader.GetOrdinal(x.Name) != -1)
                        .ToList();
                    
                    while (reader.Read())
                    {
                        var inst = Activator.CreateInstance<T>();
                        
                        foreach (var pInfo in pInfoCollection)
                        {
                            object value = Convert.ChangeType(reader[pInfo.Name], pInfo.PropertyType);
                            pInfo.SetValue(inst, value, new object[] { });
                        }
                                
                        yield return inst;
                    }
                }
            }
    	}
    	
    	public IEnumerable<T> Run<Y>(string strSql, Y args, Dictionary<string, object> whereArgs)
    	{
            var argsInfoCollection = typeof(Y).GetProperties();

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                foreach (var pInfo in argsInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(args));
                }
                
                foreach (var kvp in whereArgs)
                {
                    command.Parameters.AddWithValue(kvp.Key, kvp.Value);
                }
                
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    var pInfoCollection = typeof(T).GetProperties()
                        .Where(x => reader.GetOrdinal(x.Name) != -1)
                        .ToList();
                    
                    while (reader.Read())
                    {
                        var inst = Activator.CreateInstance<T>();
                        
                        foreach (var pInfo in pInfoCollection)
                        {
                            object value = Convert.ChangeType(reader[pInfo.Name], pInfo.PropertyType);
                            pInfo.SetValue(inst, value, new object[] { });
                        }

                        yield return inst;
                    }
                }
            }
        }
        
        public int Insert<Y>(string strSql, Y args)
        {
            var argsInfoCollection = typeof(Y).GetProperties();

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                foreach (var pInfo in argsInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(args));
                }

                return command.ExecuteNonQuery();
            }
        }
        
        public int Update<Y, Z>(string strSql, Y args, Z whereArgs)
        {
            var argsInfoCollection = typeof(Y).GetProperties();
            var whereInfoCollection = typeof(Z).GetProperties();

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                foreach (var pInfo in argsInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(args));
                }
                
                foreach (var pInfo in whereInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(whereArgs));
                }
                
                return command.ExecuteNonQuery();
            }
        }
        
        public int Delete<Y>(string strSql, Y whereArgs)
        {
            var whereInfoCollection = typeof(Y).GetProperties();

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                foreach (var pInfo in whereInfoCollection)
                {
                    command.Parameters.AddWithValue(":" + pInfo.Name, pInfo.GetValue(whereArgs));
                }
                
                return command.ExecuteNonQuery();
            }
        }
    }
}