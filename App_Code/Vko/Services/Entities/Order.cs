using System;
using System.Collections.Generic;

namespace Vko.Services.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public string CustomerId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal Freight { get; set; }
        
        public IEnumerable<OrderDetail> OrderDetail { get; set; }
    }
}
