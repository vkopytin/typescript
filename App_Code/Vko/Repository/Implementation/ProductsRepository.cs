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
    class ProductsRepository<T> : IProductsRepository<T>
    {
        static readonly string[] fields = "ProductName,UnitPrice,UnitsOnOrder,QuantityPerUnit,SupplierId,CategoryId,UnitsInStock,ReorderLevel,Discontinued".Split(',');

        DataQuery<T> query;
        
        public ProductsRepository(SQLiteConnection conn)
        {
            query = new DataQuery<T>(conn);
        }
        
        public T GetById(object id)
        {
            string sqlGetById = "SELECT * FROM Product WHERE Id = :id";
            
            return query.SingleResult(sqlGetById, new {
                Id = id
            });
        }
        
        public IEnumerable<T> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM Product ORDER BY Id LIMIT :count OFFSET :from";
            
            return query.Run(strSql, new {
                from = from,
                count = count
            });
        }

        static string strSqlSearch = @"( SELECT DISTINCT Id, seed FROM (
    SELECT p.Id, 1 AS seed FROM Product p WHERE p.ProductName = :searchExact
    UNION
    SELECT p.Id, 0.99 AS seed FROM Product p WHERE p.ProductName LIKE :search
    UNION
    SELECT p.Id, 0.98 AS seeed FROM Product p WHERE p.UnitPrice = :searchExact
    UNION
    SELECT p.Id, 0.97 AS seeed FROM Product p WHERE p.QuantityPerUnit LIKE :search
    UNION
    SELECT p.Id, 0.95 AS seeed FROM Product p WHERE cast(p.UnitPrice as text) LIKE :search
    UNION
    SELECT p.Id, 0.82 AS seeed FROM Product p, Supplier s
    WHERE p.SupplierId = s.Id AND s.CompanyName LIKE :search
    UNION
    SELECT p.Id, 0.81 AS seeed FROM Product p, Supplier s
    WHERE p.SupplierId = s.Id AND s.ContactName LIKE :search
    UNION
    SELECT p.Id, 0.80 AS seeed FROM Product p, Supplier s
    WHERE p.SupplierId = s.Id AND s.Address LIKE :search
    UNION
    SELECT p.Id, 0.71 AS seeed FROM Product p, Category c
    WHERE p.CategoryId = c.Id AND c.CategoryName LIKE :search
    UNION
    SELECT p.Id, 0.70 AS seeed FROM Product p, Category c
    WHERE p.CategoryId = c.Id AND c.Description LIKE :search
    )
) res";

        public IEnumerable<T> Find<Y>(Y args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM Product WHERE " + sqlWhere;
            if (tupleWhere.Item2.ContainsKey(":search"))
            {
                strSql = string.Format("SELECT p.* FROM Product p, {0} WHERE p.Id = res.Id ORDER BY seed DESC", strSqlSearch);
                return query.Run(strSql, new {
                    search = tupleWhere.Item2[":search"],
                    searchExact = tupleWhere.Item2[":searchExact"]
                }, tupleWhere.Item2);
            }
            
            return query.Run(strSql, new {}, tupleWhere.Item2);
	    }
        
        public T Create(T product)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();

            var strSql = string.Format(
                "INSERT INTO Product ({0}) VALUES ({1})",
                string.Join(", ", pInfoCollection.Select(x => x.Name)),
                string.Join(", ", pInfoCollection.Select(x => ":" + x.Name))
                );
            
            int rows = query.Insert(strSql, product);
            if (rows > 0)
            {
                object lastId = query.Scalar("SELECT last_insert_rowid()", new {});
                
                return GetById(lastId);
            }
                
            return default(T);
        }
        
        public T Update(object id, T product)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();
                
            string strSql = string.Format(
                "UPDATE Product SET {0} WHERE Id = :id",
                string.Join(", ", pInfoCollection.Select(x => x.Name + " = :" + x.Name))
                );
                
            var res = query.Update(strSql, product, new {
                Id = id
            });
            
            return GetById(id);
        }
        
        public int GetCount()
        {
            return Convert.ToInt32(query.Scalar("SELECT COUNT(*) FROM Product", new {}));
        }
        
        public int RemoveById(object id)
        {
            string strSql = @"DELETE FROM Product WHERE Id = :id";

            return query.Delete(strSql, new {
                Id = id
            });
        }
	}
}