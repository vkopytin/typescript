using System;
using System.Collections.Generic;

namespace Vko.Repository.Entities
{
    public class OrderDetail
    {
        public string Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public double Discount { get; set; }
    }
}
