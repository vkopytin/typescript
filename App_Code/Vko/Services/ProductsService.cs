using System;
using System.Collections.Generic;
using System.Linq;

using Vko.Services.Entities;

namespace Vko.Services
{
	public class ProductsService
	{
		public IEnumerable<Product> List()
		{
            var products = Vko.Repository.General.Request<Vko.Entities.Product>();
			var p = products.Find(new {
				Id = new { __in = new int[] {1,2,3,4,5} }
			});
			var categories = Vko.Repository.General.Request<Vko.Entities.Category>().List().ToList();
			var suppliers = Vko.Repository.General.Request<Vko.Entities.Supplier>().List().ToList();
			
			foreach (var entity in products.List())
			{
				yield return new Product
				{
	                Id = entity.Id,
	                ProductName = entity.ProductName,
	                UnitPrice = entity.UnitPrice,
	                UnitsOnOrder = entity.UnitsOnOrder,
	                QuantityPerUnit = entity.QuantityPerUnit,
					
					Category = categories.FirstOrDefault(x => x.Id == entity.CategoryId),
					Supplier = suppliers.FirstOrDefault(x => x.Id == entity.SupplierId)
				};
			}
		}
	}
}