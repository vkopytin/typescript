using System;
using System.Collections.Generic;
using System.Linq;

using Vko.Repository;
using Vko.Services.Entities;

namespace Vko.Services
{
	public class ProductsService
	{
		public IEnumerable<Product> ListProducts(int from=0, int limit=0)
		{
			using (var repo = new General())
			{
				return ListProducts(repo);
			}
		}
		
		public IEnumerable<OrderDetail> ListOrderDetails()
		{
			using (var repo = new General())
			{
				return ListOrderDetails(repo);
			}
		}
		
		public IEnumerable<Order> ListOrders(int from, int limit)
		{
			using (var repo = new General())
			{
	            var orders = repo.Request<Vko.Entities.Order>();
				var details = ListOrderDetails(repo).ToList();
				
				foreach (var entity in orders.List())
				{
					yield return new Order
					{
		                Id = entity.Id,
		                OrderDate = entity.OrderDate.ToJSLong(),
						OrderDetail = details.Where(x => x.OrderId == entity.Id).ToList()
					};
				}
			}
		}

		private IEnumerable<Product> ListProducts(General repo)
		{
            var products = repo.Request<Vko.Entities.Product>();
			var p = products.Find(new {
				Id = new { __in = new int[] {1,2,3,4,5} }
			});
			var categories = repo.Request<Vko.Entities.Category>().List().ToList();
			var suppliers = repo.Request<Vko.Entities.Supplier>().List().ToList();
			
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
		
		private IEnumerable<OrderDetail> ListOrderDetails(General repo)
		{
			var details = repo.Request<Vko.Entities.OrderDetail>();
            var products = ListProducts(repo).ToList();

			foreach (var entity in details.List())
			{
				yield return new OrderDetail
				{
	                Id = entity.Id,
					OrderId = entity.OrderId,
					UnitPrice = entity.UnitPrice,
					Quantity = entity.Quantity,
					Discount = entity.Discount,
					Order = null, // TBD
					Product = products.FirstOrDefault(x => x.Id == entity.ProductId),
				};
			}
		}
	}
}