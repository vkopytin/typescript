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
    class SuppliersRepository<T> : ISuppliersRepository<T>
    {
        static readonly string[] fields = "CompanyName,ContactName,ContactTitle,Address,City".Split(',');

        DataQuery<T> query;
        
        public SuppliersRepository(SQLiteConnection conn)
        {
            query = new DataQuery<T>(conn);
        }
        
        public T GetById(object id)
        {
            string strSql = "SELECT * FROM Supplier WHERE Id = :id";

            return query.SingleResult(strSql, new {
                Id = id
            });
        }
        
        public IEnumerable<T> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM Supplier ORDER BY Id LIMIT :count OFFSET :from";
            
            return query.Run(strSql, new {
                from = from,
                count = count
            });
        }

        static string strSqlSearch = @" 
( SELECT Id, MAX(seed) AS seed FROM (
    SELECT s.Id, 1 AS seeed FROM [Supplier] s WHERE s.CompanyName = :searchExact
    UNION
    SELECT s.Id, 0.99 AS seeed FROM [Supplier] s WHERE s.CompanyName LIKE :search
    ) GROUP BY ID ORDER BY seed
) res";

        public IEnumerable<T> Find<Y>(Y args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM [Supplier] WHERE " + sqlWhere;
            //throw new Exception(strSql);
            if (tupleWhere.Item2.ContainsKey(":search"))
            {
                strSql = string.Format("SELECT s.* FROM [Supplier] s, {0} WHERE s.Id = res.Id ORDER BY res.seed DESC", strSqlSearch);
                return query.Run(strSql, new {
                    search = tupleWhere.Item2[":search"],
                    searchExact = tupleWhere.Item2[":searchExact"]
                }, tupleWhere.Item2);
            }
            
            return query.Run(strSql, new {}, tupleWhere.Item2);
	    }
        
        public T Create(T supplier)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();

            var strSql = string.Format(
                "INSERT INTO [Supplier] ({0}) VALUES ({1})",
                string.Join(", ", pInfoCollection.Select(x => x.Name)),
                string.Join(", ", pInfoCollection.Select(x => ":" + x.Name))
                );
            
            int rows = query.Insert(strSql, supplier);
            if (rows > 0)
            {
                object lastId = query.Scalar("SELECT last_insert_rowid()", new {});
                
                return GetById(lastId);
            }

            return default(T);
        }
        
        public T Update(object id, T supplier)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();
                
            string strSql = string.Format(
                "UPDATE [Supplier] SET {0} WHERE Id = :oid",
                string.Join(", ", pInfoCollection.Select(x => x.Name + " = :" + x.Name))
                );

            var res = query.Update(strSql, supplier, new {
                oid = id
            });
            
            return GetById(id);
        }
        
        public int GetCount()
        {
            return Convert.ToInt32(query.Scalar("SELECT COUNT(*) FROM [Supplier]", new {}));
        }
        
        public int RemoveById(object id)
        {
            string strSql = @"DELETE FROM [Supplier] WHERE Id = :id";

            return query.Delete(strSql, new {
                Id = id
            });
        }
	}
}