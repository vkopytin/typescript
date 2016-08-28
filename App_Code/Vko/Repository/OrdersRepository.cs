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
    class OrdersRepository : IRepository<Order>
    {
        SQLiteConnection conn;
        
        public OrdersRepository(SQLiteConnection conn)
        {
            this.conn = conn;
        }
        
        public Order GetById(object id)
        {
            string strSql = "SELECT * FROM [Order] WHERE Id = :id";

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
        
        public IEnumerable<Order> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM [Order] ORDER BY OrderDate DESC LIMIT :count OFFSET :from";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":count", count);
                command.Parameters.AddWithValue(":from", from);
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
        
        public Order Create(Order order)
        {
                var strSql = @"INSERT INTO
                        [Order] (CustomerId, EmployeeId, OrderDate, Freight)
                        VALUES (:customerId,:employeeId,:orderDate,:freight)";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":customerId", order.CustomerId);    
                command.Parameters.AddWithValue(":employeeId", order.EmployeeId);
                command.Parameters.AddWithValue(":orderDate", order.OrderDate);
                command.Parameters.AddWithValue(":freight", order.Freight);    

                int rows = command.ExecuteNonQuery();
                if (rows > 0)
                {
                    using (SQLiteCommand command2 = new SQLiteCommand("SELECT last_insert_rowid()", conn))
                    {
                        int id = Convert.ToInt32(command2.ExecuteScalar());
                        
                        return GetById(id);
                    }
                }
                
                return order;
            }
        }
        
        public Order Update(Order order)
        {
            string strSql = @"UPDATE [Order]
                SET
                 CustomerId=:customerId,
                 EmployeeId=:employeeId,
                 OrderDate=:orderDate
                WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":customerId", order.CustomerId);
                command.Parameters.AddWithValue(":employeeId", order.EmployeeId);
                command.Parameters.AddWithValue(":orderDate", order.OrderDate);
                command.Parameters.AddWithValue(":id", order.Id);
                
                var rows = command.ExecuteNonQuery();
            }
            
            return GetById(order.Id);
        }
        
	    public IEnumerable<Order> Find<T>(T args) {
            var step = 100;
            var count = this.GetCount();
            var mod = count % step;
            var max = count - mod;
            foreach (var from in Enumerable.Range(0, max / step))
            {
                foreach (var item in this.List(from * step, step))
                {
                    yield return item;
                }
            }
            foreach (var item in this.List(max, mod))
            {
                yield return item;
            }
	    }
        
        public int GetCount()
        {
            using (SQLiteCommand command = new SQLiteCommand("SELECT COUNT(*) FROM [Order]", conn))
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