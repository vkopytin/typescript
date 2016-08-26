using System;
using System.Collections.Generic;
using System.Linq;

using Vko.Repository;
using Vko.Services.Entities;

namespace Vko.Services
{
	public class ProductsService
	{
		public IEnumerable<Product> ListProducts(int from=0, int count=10)
		{
			using (var repo = new General())
			{
				return ListProducts(repo, from, count).ToList();
			}
		}
		
		public PagedResult<Product> FindProductsPaged(string search)
		{
			using (var repo = new General())
			{
				var items = FindProducts(repo, new { search = search }).ToList();
				return new PagedResult<Product>()
				{
					Total = items.Count,
					Items = items
				};
			}
		}

		public PagedResult<Product> ListProductsPaged(int from=0, int count=10)
		{
			using (var repo = new General())
			{
				return new PagedResult<Product>()
				{
					Total = TotalProducts(repo),
					Items = ListProducts(repo, from, count).ToList()
				};
			}
		}
				
		public IEnumerable<OrderDetail> ListOrderDetails(int from=0, int count=10)
		{
			using (var repo = new General())
			{
				return ListOrderDetails(repo, from, count).ToList();
			}
		}
		
		public IEnumerable<Order> ListOrders(int from, int count)
		{
			using (var repo = new General())
			{
	            var orders = repo.Request<Vko.Entities.Order>().List(from, count);
				var details = FindOrderDetails(repo, new {
					OrderId = new {
						__in = orders.Select(x => x.Id).Distinct().ToArray()
					}
				}).ToList();
				
				foreach (var entity in orders)
				{
					yield return new Order
					{
		                Id = entity.Id,
		                OrderDate = entity.OrderDate.ToJSLong(),
						OrderDetail = details
							.Where(x => x.OrderId == entity.Id)
							.ToList()
					};
				}
			}
		}
		
		private int TotalProducts(General repo)
		{
			return repo.Request<Vko.Entities.Product>().GetCount();
		}

		private IEnumerable<Product> ListProducts(General repo, int from=0, int count=10)
		{
            var products = repo.Request<Vko.Entities.Product>().List(from, count);

			var categories = repo.Request<Vko.Entities.Category>().Find(new {
				Id = new {
					__in = products.Select(x => x.CategoryId).Distinct().ToArray()
				}
			}).ToList();
			var suppliers = repo.Request<Vko.Entities.Supplier>().Find(new {
				Id = new {
					__in = products.Select(x => x.SupplierId).Distinct().ToArray()
				}
			}).ToList();
			
			foreach (var entity in products)
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
		
		private IEnumerable<Product> FindProducts<T>(General repo, T args)
		{
            var products = repo.Request<Vko.Entities.Product>().Find(args);

			var categories = repo.Request<Vko.Entities.Category>().Find(new {
				Id = new {
					__in = products.Select(x => x.CategoryId).Distinct().ToArray()
				}
			}).ToList();
			var suppliers = repo.Request<Vko.Entities.Supplier>().Find(new {
				Id = new {
					__in = products.Select(x => x.SupplierId).Distinct().ToArray()
				}
			}).ToList();
			
			foreach (var entity in products)
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
		
		private IEnumerable<OrderDetail> ListOrderDetails(General repo, int from=0, int count=10)
		{
			var details = repo.Request<Vko.Entities.OrderDetail>().List(from, count);
            var products = ListProducts(repo).ToList();

			foreach (var entity in details)
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

		private IEnumerable<OrderDetail> FindOrderDetails<T>(General repo, T args)
		{
			var details = repo.Request<Vko.Entities.OrderDetail>().Find(args).ToList();
            var products = FindProducts(repo, new {
				Id = new {
					__in = details.Select(x => x.ProductId).Distinct().ToArray()
				}
			}).ToList();

			foreach (var entity in details)
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