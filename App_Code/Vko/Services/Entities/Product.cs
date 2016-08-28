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
		
		public Vko.Repository.Entities.Category Category { get; set; }
		public Vko.Repository.Entities.Supplier Supplier { get; set; }
	}
}