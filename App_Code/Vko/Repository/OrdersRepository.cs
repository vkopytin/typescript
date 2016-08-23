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
    class OrdersRepository : IRepository<Order>
    {
        SQLiteConnection conn;
        
        public OrdersRepository(SQLiteConnection conn)
        {
            this.conn = conn;
        }
        
        public Order GetById(object id)
        {
            string strSql = "SELECT * FROM Order WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":id", id);
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    reader.Read();
                    
                    return new Order {
                        Id = Convert.ToInt32(reader["Id"]),
                        CustomerId = Convert.ToString(reader["CustomerId"]),
                        EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                        OrderDate = Convert.ToDateTime(reader["OrderDate"])
                    };
                }
            }
        }
        
        public IEnumerable<Order> List()
        {
            string strSql = "SELECT * FROM [Order] ORDER BY Id";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                using(SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        yield return new Order {
                            Id = Convert.ToInt32(reader["Id"]),
                            CustomerId = Convert.ToString(reader["CustomerId"]),
                            EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
                            OrderDate = Convert.ToDateTime(reader["OrderDate"])
                        };
                    }
                }
            }
        }
        
        public Order Create(Order category)
        {
                var strSql = @"INSERT INTO
                        Order (CustomerId, EmployeeId, OrderDate)
                        VALUES (:customerId,:employeeId,:orderDate)";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":customerId", category.CustomerId);    
                command.Parameters.AddWithValue(":employeeId", category.EmployeeId);
                command.Parameters.AddWithValue(":orderDate", category.OrderDate);

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
        
        public Order Update(Order category)
        {
            string strSql = @"UPDATE Order
                SET
                 CustomerId=:customerId,
                 EmployeeId=:employeeId,
                 OrderDate=:orderDate
                WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":customerId", category.CustomerId);
                command.Parameters.AddWithValue(":employeeId", category.EmployeeId);
                command.Parameters.AddWithValue(":orderDate", category.OrderDate);
                command.Parameters.AddWithValue(":id", category.Id);
                
                var rows = command.ExecuteNonQuery();
            }
            
            return GetById(category.Id);
        }
        
	    public IEnumerable<Order> Find<T>(T args) {
            return this.List();
	    }
	}
}