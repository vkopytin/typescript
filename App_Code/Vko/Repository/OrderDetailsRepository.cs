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
                    while (reader.Read())
                    {
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
            return null;
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
        
        public OrderDetail Create(OrderDetail orderDetail)
        {

                var strSql = @"INSERT INTO
                        OrderDetail (Id, OrderId, ProductId, UnitPrice, Quantity, Discount)
                        VALUES (:id, :orderId,:productId,:unitPrice,:quantity,:discount)";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":id", orderDetail.Id);    
                command.Parameters.AddWithValue(":orderId", orderDetail.OrderId);    
                command.Parameters.AddWithValue(":productId", orderDetail.ProductId);
                command.Parameters.AddWithValue(":unitPrice", orderDetail.UnitPrice);
                command.Parameters.AddWithValue(":quantity", orderDetail.Quantity);
                command.Parameters.AddWithValue(":discount", orderDetail.Discount);

                int rows = command.ExecuteNonQuery();
                if (rows > 0)
                {
                    using (SQLiteCommand command2 = new SQLiteCommand("SELECT last_insert_rowid()", conn))
                    {
                        int id = Convert.ToInt32(command2.ExecuteScalar());
                        
                        return GetById(id);
                    }
                }
                
                return orderDetail;
            }
        }
        
        public OrderDetail Update(OrderDetail orderDetail)
        {
            string strSql = @"UPDATE OrderDetail
                SET
                 OrderId=:orderId,
                 ProductId=:productId,
                 UnitPrice=:unitPrice,
                 Quantity=:quantity,
                 Discount=:discount
                WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":orderId", orderDetail.OrderId);
                command.Parameters.AddWithValue(":productId", orderDetail.ProductId);
                command.Parameters.AddWithValue(":unitPrice", orderDetail.UnitPrice);
                command.Parameters.AddWithValue(":quantity", orderDetail.Quantity);
                command.Parameters.AddWithValue(":discount", orderDetail.Discount);
                command.Parameters.AddWithValue(":id", orderDetail.Id);
                
                var rows = command.ExecuteNonQuery();
            }
            
            return GetById(orderDetail.Id);
        }
        
            static string strSqlSearch = @"Id IN 
( SELECT DISTINCT Id FROM (
    SELECT od.Id, 0.98 AS seeed FROM OrderDetail od WHERE od.UnitPrice = :searchExact
    UNION
    SELECT od.Id, 0.97 AS seeed FROM OrderDetail od WHERE od.Quantity LIKE :search
    UNION
    SELECT od.Id, 0.95 AS seeed FROM OrderDetail od WHERE cast(od.UnitPrice as text) LIKE :search
    ) ORDER BY seed DESC
)";

        public IEnumerable<OrderDetail> Find<T>(T args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM OrderDetail WHERE " + sqlWhere;
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
        
        public int GetCount()
        {
            using (SQLiteCommand command = new SQLiteCommand("SELECT COUNT(*) FROM OrderDetail", conn))
            {
                int count = Convert.ToInt32(command.ExecuteScalar());
                return count;
            }
        }
        
        public int RemoveById(object Id)
        {
            string strSql = @"DELETE FROM OrderDetail WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":id", Id);
                
                var rows = command.ExecuteNonQuery();
                
                return rows;
            }
        }
	}
}