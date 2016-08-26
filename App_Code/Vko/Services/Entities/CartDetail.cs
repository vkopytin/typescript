using System;
using System.Collections.Generic;

namespace Vko.Services.Entities
{
    public class CartDetail
    {
        public string Id { get; set; }
        public int OrderId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public double Discount { get; set; }

        public Order Order { get; set; }
        public Product Product { get; set; }
    }
}
