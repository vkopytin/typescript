using System;
using System.Collections.Generic;

namespace Vko.Repository.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public int UnitsOnOrder { get; set; }
        public string QuantityPerUnit { get; set; }
        public int UnitsInStock { get; set; }
        public int ReorderLevel { get; set; }
        public int Discontinued { get; set; }
        
        public int CategoryId { get; set; }
        public int SupplierId { get; set; }
        
        public Product ()
        {
            UnitsInStock = 0;
            ReorderLevel = 0;
            Discontinued = 0;
        }
    }
    
}
