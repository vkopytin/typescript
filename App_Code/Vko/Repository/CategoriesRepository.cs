using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using Vko.Entities;


namespace Vko.Repository
{
    class CategoriesRepository : IRepository<Category>
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
                    reader.Read();
                    
                    return new Category {
                        Id = Convert.ToInt32(reader["Id"]),
                        CategoryName = Convert.ToString(reader["CategoryName"]),
                        Description = Convert.ToString(reader["Description"])
                    };
                }
            }
        }
        
        public IEnumerable<Category> List()
        {
            string strSql = "SELECT * FROM Category ORDER BY Id";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
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
        
	    public IEnumerable<Category> Find<T>(T args) {
            return this.List();
	    }
	}
}