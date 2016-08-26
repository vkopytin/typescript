using System;
using System.Collections.Generic;

namespace Vko.Services.Entities
{
    public class Cart
    {
        public int Id { get; set; }
        public long CartDate { get; set; }
        
        public IEnumerable<CartDetail> CartDetail { get; set; }
    }
}
