using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Data.SQLite;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using hellomvc;
using Vko.Entities;


namespace Vko.Repository {
    
    class ProductsRepository : IRepository<Product>
    {
        public ProductsRepository()
        {
        }
        
        public Product GetById(int id)
        {
            string strSql = "SELECT * FROM Product WHERE Id = :id";
            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                conn.Open();
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
        }
        
        public IEnumerable<Product> List()
        {
            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                conn.Open();
                string strSql = "SELECT * FROM Product ORDER BY Id";
                using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
                {
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
        }
        
        public Product Create(Product product)
        {
            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                var strSql = @"INSERT INTO
                        Product (ProductName, UnitPrice, UnitsOnOrder, QuantityPerUnit, SupplierId, CategoryId, UnitsInStock, ReorderLevel, Discontinued)
                        VALUES (:productName,:unitPrice,:unitsOnOrder,:quantityPerUnit,:supplierId,:categoryId,:unitsInStock,:reorderLevel,:discontinued)";
                conn.Open();
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

            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                conn.Open();
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
            }
            
            return GetById(product.Id);
        }
        
	    public IEnumerable<Product> Find<T>(T args) {
            return new List<Product>();
	    }
	}
}