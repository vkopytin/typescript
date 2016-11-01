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
    class CategoriesRepository<T> : ICategoriesRepository<T>
    {
        static readonly string[] fields = "CategoryName,Description".Split(',');

        DataQuery<T> query;

        public CategoriesRepository(SQLiteConnection conn)
        {
            this.query = new DataQuery<T>(conn);
        }
        
        public T GetById(object id)
        {
            string strSql = "SELECT * FROM [Category] WHERE Id = :id";
            
            return this.query.SingleResult(strSql, new {
                Id = id
            });
        }
        
        public IEnumerable<T> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM Category ORDER BY Id LIMIT :count OFFSET :from";
            
            return this.query.Run(strSql, new {
                from = from,
                count = count
            });
        }

        static string strSqlSearch = @" 
( SELECT Id, MAX(seed) AS seed FROM (
    SELECT c.Id, 1 AS seeed FROM Categoy c WHERE c.CategoryName = :searchExact
    UNION
    SELECT c.Id, 0.99 AS seeed FROM Category c WHERE c.CategoryName LIKE :search
    UNION
    SELECT c.Id, 0.98 AS seeed FROM Category c WHERE c.Description LIKE :search
    ) GROUP BY ID ORDER BY seed
) res";

        public IEnumerable<T> Find<Y>(Y args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM Category WHERE " + sqlWhere;
            //throw new Exception(strSql);
            if (tupleWhere.Item2.ContainsKey(":search"))
            {
                strSql = string.Format("SELECT c.* FROM Category c, {0} WHERE c.Id = res.Id ORDER BY res.seed DESC", strSqlSearch);
                return this.query.Run(strSql, new {
                    search = tupleWhere.Item2[":search"],
                    searchExact = tupleWhere.Item2[":searchExact"]
                }, tupleWhere.Item2);
            }
            
            return this.query.Run(strSql, new {}, tupleWhere.Item2);
	    }
        
        public T Create(T category)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();

            var strSql = string.Format(
                "INSERT INTO Category ({0}) VALUES ({1})",
                string.Join(", ", pInfoCollection.Select(x => x.Name)),
                string.Join(", ", pInfoCollection.Select(x => ":" + x.Name))
                );
            
            int rows = this.query.Insert(strSql, category);
            if (rows > 0)
            {
                object lastId = query.Scalar("SELECT last_insert_rowid()", new {});
                
                return this.GetById(lastId);
            }

            return default(T);
        }
        
        public T Update(object id, T category)
        {
            var pInfoCollection = typeof(T).GetProperties()
                .Where(x => Array.IndexOf(fields, x.Name) != -1)
                .ToList();
                
            string strSql = string.Format(
                "UPDATE Category SET {0} WHERE Id = :id",
                string.Join(", ", pInfoCollection.Select(x => x.Name + " = :" + x.Name))
                );
                
            var res = this.query.Update(strSql, category, new {
                Id = id
            });
            
            return this.GetById(id);
        }
                
        public int GetCount()
        {
            return Convert.ToInt32(query.Scalar("SELECT COUNT(*) FROM Category", new {}));
        }
        
        public int RemoveById(object id)
        {
            string strSql = @"DELETE FROM Category WHERE Id = :id";

            return this.query.Delete(strSql, new {
                Id = id
            });
        }
	}
}