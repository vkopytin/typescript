using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;


namespace Vko.Repository.Implementation
{
    class OrderDetailsRepository<T> : IOrderDetailsRepository<T>
    {
        static readonly string[] fields = "Id,OrderId,ProductId,UnitPrice,Quantity,Discount".Split(',');

        DataQuery<T> query;
        
        public OrderDetailsRepository(SQLiteConnection conn)
        {
            query = new DataQuery<T>(conn);
        }
        
        public T GetById(object id)
        {
            string strSql = "SELECT * FROM OrderDetail WHERE Id = :id";

            return query.SingleResult(strSql, new {
                Id = id
            });
        }
        
        public IEnumerable<T> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM [OrderDetail] ORDER BY Id LIMIT :count OFFSET :from";

            return query.Run(strSql, new {
                from = from,
                count = count
            });
        }

        static string strSqlSearch = @" 
( SELECT DISTINCT Id, seed FROM (
    SELECT od.Id, 1 AS seeed FROM OrderDetail od WHERE d.UnitPrice = :searchExact
    UNION
    SELECT od.Id, 0.99 AS seeed FROM OrderDetail od WHERE cast(od.UnitPrice as text) LIKE :search
    UNION
    SELECT od.Id, 0.97 AS seeed FROM OrderDetail od WHERE od.Quantity LIKE :search
    UNION
    SELECT p.Id, 0.82 AS seeed FROM Product p, OrderDetail od
    WHERE p.Id = od.ProductId AND s.ProductName LIKE :search
    )
) res";

        public IEnumerable<T> Find<Y>(Y args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM OrderDetail WHERE " + sqlWhere;
            //throw new Exception(strSql);
            if (tupleWhere.Item2.ContainsKey(":search"))
            {
                strSql = string.Format("SELECT od.* FROM OrderDetail od, {0} WHERE od.Id = res.Id ORDER BY seed DESC", strSqlSearch);
                return query.Run(strSql, new {
                    search = tupleWhere.Item2[":search"],
                    searchExact = tupleWhere.Item2[":searchExact"]
                }, tupleWhere.Item2);
            }
            
            return query.Run(strSql, new {}, tupleWhere.Item2);
	    }
            
        public T Create(T orderDetail)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();

            var strSql = string.Format(
                "INSERT INTO OrderDetail ({0}) VALUES ({1})",
                string.Join(", ", pInfoCollection.Select(x => x.Name)),
                string.Join(", ", pInfoCollection.Select(x => ":" + x.Name))
                );
            
            int rows = query.Insert(strSql, orderDetail);
            if (rows > 0)
            {
                object lastId = query.Scalar("SELECT last_insert_rowid()", new {});
                
                return GetById(lastId);
            }
                
            return default(T);
        }
        
        public T Update(object id, T orderDetail)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();
                
            string strSql = string.Format(
                "UPDATE OrderDetail SET {0} WHERE Id = :oid",
                string.Join(", ", pInfoCollection.Select(x => x.Name + " = :" + x.Name))
                );

            var res = query.Update(strSql, orderDetail, new {
                oid = id
            });
            
            return GetById(id);
        }
        
        public int GetCount()
        {
            return Convert.ToInt32(query.Scalar("SELECT COUNT(*) FROM OrderDetail", new {}));
        }
        
        public int RemoveById(object id)
        {
            string strSql = @"DELETE FROM OrderDetail WHERE Id = :id";

            return query.Delete(strSql, new {
                Id = id
            });
        }
	}
}