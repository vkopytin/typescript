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
    
    class SuppliersRepository : IRepository<Supplier>
    {
        public SuppliersRepository()
        {
        }
        
        public Supplier GetById(int id)
        {
            string strSql = "SELECT * FROM Supplier WHERE Id = :id";
            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                conn.Open();
                using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
                {
                    command.Parameters.AddWithValue(":id", id);
                    using (SQLiteDataReader reader = command.ExecuteReader())
                    {
                        reader.Read();
                        
                        return new Supplier {
                            Id = Convert.ToInt32(reader["Id"]),
                            CompanyName = Convert.ToString(reader["CompanyName"]),
                            ContactName = Convert.ToString(reader["ContactName"]),
                            ContactTitle = Convert.ToString(reader["ContactTitle"]),
                            Address = Convert.ToString(reader["Address"]),
                            City = Convert.ToString(reader["City"])
                        };
                    }
                }
            }
        }
        
        public IEnumerable<Supplier> List()
        {
            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                conn.Open();
                string strSql = "SELECT * FROM Supplier ORDER BY Id";
                using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
                {
                    using(SQLiteDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            yield return new Supplier {
                                Id = Convert.ToInt32(reader["Id"]),
                                CompanyName = Convert.ToString(reader["CompanyName"]),
                                ContactName = Convert.ToString(reader["ContactName"]),
                                ContactTitle = Convert.ToString(reader["ContactTitle"]),
                                Address = Convert.ToString(reader["Address"]),
                                City = Convert.ToString(reader["City"])
                            };
                        }
                    }
                }
            }
        }
        
        public Supplier Create(Supplier supplier)
        {
            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                var strSql = @"INSERT INTO
                        Supplier (CompanyName, ContactName, ContactTitle, Address, City)
                        VALUES (:companyName,:contactName,:contactTitle,:address,:city)";
                conn.Open();
                using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
                {
                    command.Parameters.AddWithValue(":companyName", supplier.CompanyName);
                    command.Parameters.AddWithValue(":contactName", supplier.ContactName);
                    command.Parameters.AddWithValue(":ContactTitle", supplier.ContactTitle);
                    command.Parameters.AddWithValue(":address", supplier.Address);
                    command.Parameters.AddWithValue(":city", supplier.City);
    
                    int rows = command.ExecuteNonQuery();
                    if (rows > 0)
                    {
                        using (SQLiteCommand command2 = new SQLiteCommand("SELECT last_insert_rowid()", conn))
                        {
                            int id = Convert.ToInt32(command2.ExecuteScalar());
                            
                            return GetById(id);
                        }
                    }
                    
                    return supplier;
                }
            }
        }
        
        public Supplier Update(Supplier supplier)
        {
            string strSql = @"UPDATE Supplier
                SET
                 CompanyName=:companyName,
                 ContactName=:contactName,
                 ContactTitle=:contactTitle,
                 Address=:address,
                 City=:city
                WHERE Id = :id";

            using (SQLiteConnection conn = new SQLiteConnection(Config.DefaultDB))
            {
                conn.Open();
                using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
                {
                    command.Parameters.AddWithValue(":companyName", supplier.CompanyName);
                    command.Parameters.AddWithValue(":contactName", supplier.ContactName);
                    command.Parameters.AddWithValue(":ContactTitle", supplier.ContactTitle);
                    command.Parameters.AddWithValue(":address", supplier.Address);
                    command.Parameters.AddWithValue(":city", supplier.City);
                    
                    var rows = command.ExecuteNonQuery();
                }
            }
            
            return GetById(supplier.Id);
        }
        
	    public IEnumerable<Supplier> Find<T>(T args) {
            return new List<Supplier>();
	    }
	}
}