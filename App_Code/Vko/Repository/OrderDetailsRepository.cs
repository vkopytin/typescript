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
    class OrderDetailsRepository : IRepository<OrderDetail>
    {
        SQLiteConnection conn;
        
        public OrderDetailsRepository(SQLiteConnection conn)
        {
            this.conn = conn;
        }
        
        public OrderDetail GetById(object id)
        {
            string strSql = "SELECT * FROM OrderDetail WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":id", id);
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    reader.Read();
                    
                    return new OrderDetail {
                        Id = Convert.ToString(reader["Id"]),
                        OrderId = Convert.ToInt32(reader["OrderId"]),
                        ProductId = Convert.ToInt32(reader["ProductId"]),
                        UnitPrice = Convert.ToDecimal(reader["UnitPrice"]),
                        Quantity = Convert.ToInt32(reader["Quantity"]),
                        Discount = Convert.ToDouble(reader["Discount"])
                    };
                }
            }
        }
        
        public IEnumerable<OrderDetail> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM [OrderDetail] ORDER BY Id LIMIT :count OFFSET :from";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":count", count);
                command.Parameters.AddWithValue(":from", from);
                using(SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        yield return new OrderDetail {
                            Id = Convert.ToString(reader["Id"]),
                            OrderId = Convert.ToInt32(reader["OrderId"]),
                            ProductId = Convert.ToInt32(reader["ProductId"]),
                            UnitPrice = Convert.ToDecimal(reader["UnitPrice"]),
                            Quantity = Convert.ToInt32(reader["Quantity"]),
                            Discount = Convert.ToDouble(reader["Discount"])
                        };
                    }
                }
            }
        }
        
        public OrderDetail Create(OrderDetail category)
        {

                var strSql = @"INSERT INTO
                        OrderDetail (OrderId, ProductId, UnitPrice, Quantity, Discount)
                        VALUES (:customerId,:employeeId,:orderDate,:quantity,:discount)";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":customerId", category.OrderId);    
                command.Parameters.AddWithValue(":employeeId", category.ProductId);
                command.Parameters.AddWithValue(":orderDate", category.UnitPrice);
                command.Parameters.AddWithValue(":quantity", category.Quantity);
                command.Parameters.AddWithValue(":discount", category.Discount);

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
        
        public OrderDetail Update(OrderDetail category)
        {
            string strSql = @"UPDATE OrderDetail
                SET
                 OrderId=:customerId,
                 ProductId=:employeeId,
                 UnitPrice=:orderDate,
                 Quantity=:quantity,
                 Discount=:discount
                WHERE Id = :id";


            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":customerId", category.OrderId);
                command.Parameters.AddWithValue(":employeeId", category.ProductId);
                command.Parameters.AddWithValue(":orderDate", category.UnitPrice);
                command.Parameters.AddWithValue(":quantity", category.Quantity);
                command.Parameters.AddWithValue(":discount", category.Discount);
                command.Parameters.AddWithValue(":id", category.Id);
                
                var rows = command.ExecuteNonQuery();
            }
            
            return GetById(category.Id);
        }
        
	    public IEnumerable<OrderDetail> Find<T>(T args) {
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
            using (SQLiteCommand command = new SQLiteCommand("SELECT COUNT(*) FROM OrderDetail", conn))
            {
                int count = Convert.ToInt32(command.ExecuteScalar());
                return count;
            }
        }
	}
}