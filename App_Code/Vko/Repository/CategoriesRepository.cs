using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using Vko.Repository.Entities;


namespace Vko.Repository
{
    class CategoriesRepository : ICategoriesRepository<Category>
    {
        SQLiteConnection conn;
        public CategoriesRepository(SQLiteConnection conn)
        {
            this.conn = conn;
        }
        
        public Category GetById(object id)
        {
            string strSql = "SELECT * FROM [Category] WHERE Id = :id";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":id", id);
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    while(reader.Read())
                    {
                        return new Category {
                            Id = Convert.ToInt32(reader["Id"]),
                            CategoryName = Convert.ToString(reader["CategoryName"]),
                            Description = Convert.ToString(reader["Description"])
                        };
                    }
                }
            }
            return default(Category);
        }
        
        public IEnumerable<Category> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM Category ORDER BY Id LIMIT :count OFFSET :from";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":count", count);
                command.Parameters.AddWithValue(":from", from);
                using(SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        yield return new Category {
                            Id = Convert.ToInt32(reader["Id"]),
                            CategoryName = Convert.ToString(reader["CategoryName"]),
                            Description = Convert.ToString(reader["Description"])
                        };
                    }
                }
            }
        }
        
        public Category Create(Category category)
        {
            var strSql = @"INSERT INTO
                    Category (CategoryName, Description)
                    VALUES (:categoryName,:description)";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":categoryName", category.CategoryName);    
                command.Parameters.AddWithValue(":description", category.Description);

                int rows = command.ExecuteNonQuery();
                if (rows > 0)
                {
                    using (SQLiteCommand command2 = new SQLiteCommand("SELECT last_insert_rowid()", conn))
                    {
                        int id = Convert.ToInt32(command2.ExecuteScalar());
                        
                        return GetById(id);
                    }
                }
                
                return category;
            }
        }
        
        public Category Update(Category category)
        {
            string strSql = @"UPDATE Category
                SET
                 CategoryName=:categoryName,
                 Description=:description
                WHERE Id = :id";


            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":categoryName", category.CategoryName);
                command.Parameters.AddWithValue(":description", category.Description);
                command.Parameters.AddWithValue(":id", category.Id);
                
                var rows = command.ExecuteNonQuery();
            }
            
            return GetById(category.Id);
        }
        
        static string strSqlSearch = @"Id IN 
( SELECT DISTINCT Id FROM (
    SELECT od.Id, 1 AS seeed FROM Categoy od WHERE od.CategoryName = :searchExact
    UNION
    SELECT od.Id, 0.99 AS seeed FROM Category od WHERE od.CategoryName LIKE :search
    UNION
    SELECT od.Id, 0.98 AS seeed FROM Category od WHERE od.Description LIKE :search
    ) ORDER BY seed DESC
)";

        public IEnumerable<Category> Find<T>(T args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM Category WHERE " + sqlWhere;
            //throw new Exception(strSql);
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                var queryParams = tupleWhere.Item2;
                foreach(var kvp in queryParams)
                {
                    command.Parameters.AddWithValue(kvp.Key, kvp.Value);
                }
                
                using(SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        yield return new Category {
                            Id = Convert.ToInt32(reader["Id"]),
                            CategoryName = Convert.ToString(reader["CategoryName"]),
                            Description = Convert.ToString(reader["Description"])
                        };
                    }
                }
            }
	    }
        
        public int GetCount()
        {
            using (SQLiteCommand command = new SQLiteCommand("SELECT COUNT(*) FROM Category", conn))
            {
                int count = Convert.ToInt32(command.ExecuteScalar());
                return count;
            }
        }
        
        public int RemoveById(object Id)
        {
            return 0;
        }
	}
}