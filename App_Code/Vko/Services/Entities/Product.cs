using System;


namespace Vko.Services.Entities
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

        public Category Category { get; set; }
        public Supplier Supplier { get; set; }
        
        public DateTime OrderDate { get; set; }
        public long OrderDateTs
        {
            get
            {
                return OrderDate.ToJSLong();
            }
        }

        public Product ()
        {
            UnitsInStock = 0;
            ReorderLevel = 0;
            Discontinued = 0;
        }
    }
}