using System;
using System.Collections.Generic;

namespace Vko.Services.Entities
{
    public class Supplier
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public string ContactName { get; set; }
        public string ContactTitle { get; set; }
        public string Address { get; set; }
		public string City { get; set; }
    }
    
}
