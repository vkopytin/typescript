using System;
using System.Collections.Generic;

namespace Vko.Services
{
    public class PagedResult<T>
    {
        public int Total { get; set; }
        
        public IEnumerable<T> Items { get; set; }
    }
}
