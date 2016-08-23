using System;
using System.Collections.Generic;

namespace Vko.Services.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public long OrderDate { get; set; }
        
        public IEnumerable<OrderDetail> OrderDetail { get; set; }
    }
}
