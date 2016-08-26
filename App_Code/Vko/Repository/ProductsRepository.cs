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
    class ProductsRepository : IRepository<Product>
    {
        SQLiteConnection conn;
        
        public ProductsRepository(SQLiteConnection conn)
        {
            this.conn = conn;
        }
        
        public Product GetById(object id)
        {
            string strSql = "SELECT * FROM Product WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":id", id);
                using (SQLiteDataReader reader = command.ExecuteReader())
                {
                    reader.Read();
                    
                    return new Product {
                        Id = Convert.ToInt32(reader["Id"]),
                        ProductName = Convert.ToString(reader["ProductName"]),
                        UnitPrice = Convert.ToDecimal(reader["UnitPrice"]),
                        UnitsOnOrder = Convert.ToInt32(reader["UnitsOnOrder"]),
                        QuantityPerUnit = Convert.ToString(reader["QuantityPerUnit"]),
                        CategoryId = Convert.ToInt32(reader["categoryId"]),
                        SupplierId = Convert.ToInt32(reader["supplierId"])
                    };
                }
            }
        }
        
        public IEnumerable<Product> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM Product ORDER BY Id LIMIT :count OFFSET :from";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":count", count);
                command.Parameters.AddWithValue(":from", from);
                using(SQLiteDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        yield return new Product {
                            Id = Convert.ToInt32(reader["Id"]),
                            ProductName = Convert.ToString(reader["ProductName"]),
                            UnitPrice = Convert.ToDecimal(reader["UnitPrice"]),
                            UnitsOnOrder = Convert.ToInt32(reader["UnitsOnOrder"]),
                            QuantityPerUnit = Convert.ToString(reader["QuantityPerUnit"]),
                            CategoryId = Convert.ToInt32(reader["categoryId"]),
                            SupplierId = Convert.ToInt32(reader["supplierId"])
                        };
                    }
                }
            }
        }
        
        public Product Create(Product product)
        {
            var strSql = @"INSERT INTO
                    Product (ProductName, UnitPrice, UnitsOnOrder, QuantityPerUnit, SupplierId, CategoryId, UnitsInStock, ReorderLevel, Discontinued)
                    VALUES (:productName,:unitPrice,:unitsOnOrder,:quantityPerUnit,:supplierId,:categoryId,:unitsInStock,:reorderLevel,:discontinued)";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":productName", product.ProductName);
                command.Parameters.AddWithValue(":unitPrice", product.UnitPrice);
                command.Parameters.AddWithValue(":unitsOnOrder", product.UnitsOnOrder);
                command.Parameters.AddWithValue(":quantityPerUnit", product.QuantityPerUnit);
                command.Parameters.AddWithValue(":supplierId", product.CategoryId);
                command.Parameters.AddWithValue(":categoryId", product.SupplierId);
                command.Parameters.AddWithValue(":unitsInStock", 0);
                command.Parameters.AddWithValue(":reorderLevel", 0);
                command.Parameters.AddWithValue(":discontinued", 0);

                int rows = command.ExecuteNonQuery();
                if (rows > 0)
                {
                    using (SQLiteCommand command2 = new SQLiteCommand("SELECT last_insert_rowid()", conn))
                    {
                        int id = Convert.ToInt32(command2.ExecuteScalar());
                        
                        return GetById(id);
                    }
                }
                
                return product;
            }
        }
        
        public Product Update(Product product)
        {
            string strSql = @"UPDATE Product
                SET
                 ProductName=:productName,
                 UnitPrice=:unitPrice,
                 UnitsOnOrder=:unitsOnOrder,
                 QuantityPerUnit=:quantityPerUnit
                WHERE Id = :id";


            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":productName", product.ProductName);
                command.Parameters.AddWithValue(":unitPrice", product.UnitPrice);
                command.Parameters.AddWithValue(":unitsOnOrder", product.UnitsOnOrder);
                command.Parameters.AddWithValue(":quantityPerUnit", product.QuantityPerUnit);
                command.Parameters.AddWithValue(":supplierId", product.CategoryId);
                command.Parameters.AddWithValue(":categoryId", product.SupplierId);
                command.Parameters.AddWithValue(":id", product.Id);
                
                var rows = command.ExecuteNonQuery();
            }
            
            return GetById(product.Id);
        }

            static string strSqlSearch = @"Id IN 
( SELECT DISTINCT Id FROM (
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
    ) ORDER BY seed DESC
)";

        public IEnumerable<Product> Find<T>(T args)
        {
            var tupleWhere = WhereStatements.FromArgs(args);
            string sqlWhere = string.Format(tupleWhere.Item1.ToString(), strSqlSearch);
            string strSql = "SELECT * FROM Product WHERE " + sqlWhere;
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
                        yield return new Product {
                            Id = Convert.ToInt32(reader["Id"]),
                            ProductName = Convert.ToString(reader["ProductName"]),
                            UnitPrice = Convert.ToDecimal(reader["UnitPrice"]),
                            UnitsOnOrder = Convert.ToInt32(reader["UnitsOnOrder"]),
                            QuantityPerUnit = Convert.ToString(reader["QuantityPerUnit"]),
                            CategoryId = Convert.ToInt32(reader["categoryId"]),
                            SupplierId = Convert.ToInt32(reader["supplierId"])
                        };
                    }
                }
            }
	    }
        
        public int GetCount()
        {
            using (SQLiteCommand command = new SQLiteCommand("SELECT COUNT(*) FROM Product", conn))
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