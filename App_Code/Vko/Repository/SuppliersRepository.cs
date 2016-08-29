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
    class SuppliersRepository : ISuppliersRepository<Supplier>
    {
        SQLiteConnection conn;
        
        public SuppliersRepository(SQLiteConnection conn)
        {
            this.conn = conn;
        }
        
        public Supplier GetById(object id)
        {
            string strSql = "SELECT * FROM Supplier WHERE Id = :id";

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
        
        public IEnumerable<Supplier> List(int from=0, int count=10)
        {
            string strSql = "SELECT * FROM Supplier ORDER BY Id LIMIT :count OFFSET :from";
            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":count", count);
                command.Parameters.AddWithValue(":from", from);
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
        
        public Supplier Create(Supplier supplier)
        {
            var strSql = @"INSERT INTO
                    Supplier (CompanyName, ContactName, ContactTitle, Address, City)
                    VALUES (:companyName,:contactName,:contactTitle,:address,:city)";

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
        
        public Supplier Update(Supplier supplier)
        {
            string strSql = @"UPDATE [Supplier]
                SET
                 CompanyName=:companyName,
                 ContactName=:contactName,
                 ContactTitle=:contactTitle,
                 Address=:address,
                 City=:city
                WHERE Id = :id";

            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
            {
                command.Parameters.AddWithValue(":companyName", supplier.CompanyName);
                command.Parameters.AddWithValue(":contactName", supplier.ContactName);
                command.Parameters.AddWithValue(":contactTitle", supplier.ContactTitle);
                command.Parameters.AddWithValue(":address", supplier.Address);
                command.Parameters.AddWithValue(":city", supplier.City);
                command.Parameters.AddWithValue(":id", supplier.Id);
                
                var rows = command.ExecuteNonQuery();
            }
            
            return GetById(supplier.Id);
        }
        
	    public IEnumerable<Supplier> Find<T>(T args) {
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
            using (SQLiteCommand command = new SQLiteCommand("SELECT COUNT(*) FROM Supplier", conn))
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