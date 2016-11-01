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
    class OrdersRepository<T> : IOrdersRepository<T>
    {
        static readonly string[] fields = "CustomerId,EmployeeId,OrderDate,Freight".Split(',');

        DataQuery<T> query;
        
        public OrdersRepository(SQLiteConnection conn)
        {
            this.query = new DataQuery<T>(conn);
        }
        
        public T GetById(object id)
        {
            string strSql = "SELECT * FROM [Order] WHERE Id = :id";

            return this.query.SingleResult(strSql, new {
                Id = id
            });
        }
        
        public IEnumerable<T> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM [Order] ORDER BY OrderDate DESC LIMIT :count OFFSET :from";

            return this.query.Run(strSql, new {
                from = from,
                count = count
            });
        }

        static string strSqlSearch = @" 
( SELECT Id, MAX(seed) AS seed FROM (
    SELECT o.Id, 1 AS seeed FROM [Order] o WHERE cast(o.OrderDate as text) = :searchExact
    UNION
    SELECT p.Id, 0.82 AS seeed FROM Product p, [Order] o, OrderDetail od
    WHERE o.Id = od.OrderId AND p.Id = od.ProductId AND p.ProductName LIKE :search
    ) GROUP BY ID ORDER BY seed
) res";

        public IEnumerable<T> Find<Y>(Y args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM [Order] WHERE " + sqlWhere;
            //throw new Exception(strSql);
            if (tupleWhere.Item2.ContainsKey(":search"))
            {
                strSql = string.Format("SELECT od.* FROM [Order] od, {0} WHERE od.Id = res.Id ORDER BY res.seed DESC", strSqlSearch);
                return this.query.Run(strSql, new {
                    search = tupleWhere.Item2[":search"],
                    searchExact = tupleWhere.Item2[":searchExact"]
                }, tupleWhere.Item2);
            }
            
            return this.query.Run(strSql, new {}, tupleWhere.Item2);
	    }
        
        public T Create(T order)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();

            var strSql = string.Format(
                "INSERT INTO [Order] ({0}) VALUES ({1})",
                string.Join(", ", pInfoCollection.Select(x => x.Name)),
                string.Join(", ", pInfoCollection.Select(x => ":" + x.Name))
                );
            
            int rows = this.query.Insert(strSql, order);
            if (rows > 0)
            {
                object lastId = query.Scalar("SELECT last_insert_rowid()", new {});
                
                return this.GetById(lastId);
            }

            return default(T);
        }
        
        public T Update(object id, T order)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();
                
            string strSql = string.Format(
                "UPDATE [Order] SET {0} WHERE Id = :oid",
                string.Join(", ", pInfoCollection.Select(x => x.Name + " = :" + x.Name))
                );

            var res = this.query.Update(strSql, order, new {
                oid = id
            });
            
            return this.GetById(id);
        }
        
        public int GetCount()
        {
            return Convert.ToInt32(query.Scalar("SELECT COUNT(*) FROM [Order]", new {}));
        }
        
        public int RemoveById(object id)
        {
            string strSql = @"DELETE FROM [Order] WHERE Id = :id";

            return this.query.Delete(strSql, new {
                Id = id
            });
        }

	    public IEnumerable<T> FindOld<Y>(Y args) {
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
	}
}