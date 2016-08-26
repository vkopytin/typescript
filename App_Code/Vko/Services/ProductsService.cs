using System;
using System.Collections.Generic;
using System.Linq;

using Vko.Repository;
using Vko.Services.Entities;

namespace Vko.Services
{
	public class ProductsService
	{
		public PagedResult<Cart> ListCarts(int from=0, int count=0)
		{
			using (var repo = new General())
			{
				var items = ListCarts(repo, from, count).ToList();
				return new PagedResult<Cart>()
				{
					Total = TotalCarts(repo),
					Items = items
				};
			}
		}
		
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
		
		public Cart AddToCart(int productId, decimal price)
		{
			using (var repo = new General())
			{
				var product = repo.Request<Vko.Entities.Product>().GetById(productId);
				var orderDetailsRepo = repo.Request<Vko.Entities.OrderDetail>();
				if (product == null) {
					throw new Exception(string.Format("Product with Id: {0} doesn't found in the store", productId));
				}
				
				var carts = ListCarts(repo, 0, 1);
				foreach (Cart cart in carts)
				{
					var details = orderDetailsRepo.Find(new {
						__and = new {
							OrderId = cart.Id,
							ProductId = product.Id
						}
					}).ToList();
					if (details.Count == 0) {
						var newDetail = orderDetailsRepo.Create(new Vko.Entities.OrderDetail () {
							Id = cart.Id + "/" + product.Id,
							OrderId = cart.Id,
							ProductId = product.Id,
							Quantity = 1,
							UnitPrice = product.UnitPrice,
							Discount = 0
						});
					}
					else
					{
						var existingDetail = orderDetailsRepo.Update(new Vko.Entities.OrderDetail () {
							Id = details[0].Id,
							OrderId = cart.Id,
							ProductId = product.Id,
							Quantity = details[0].Quantity + 1,
							UnitPrice = product.UnitPrice,
							Discount = 0
						});
					}
				}
				
				return ListCarts(repo, 0, 1).FirstOrDefault();
			}
		}
		
		public Cart RemoveFromCart(int productId)
		{
			using (var repo = new General())
			{
				var product = repo.Request<Vko.Entities.Product>().GetById(productId);
				var orderDetailsRepo = repo.Request<Vko.Entities.OrderDetail>();
				if (product == null) {
					throw new Exception(string.Format("Product with Id: {0} doesn't found in the store", productId));
				}
				
				var carts = ListCarts(repo, 0, 1);
				foreach (Cart cart in carts)
				{
					var details = orderDetailsRepo.Find(new {
						__and = new {
							OrderId = cart.Id,
							ProductId = product.Id
						}
					}).ToList();
					
					if (details.Count > 0)
					{
						if (details[0].Quantity < 2)
						{
							orderDetailsRepo.RemoveById(details[0].Id);
						}
						else
						{
							var existingDetail = orderDetailsRepo.Update(new Vko.Entities.OrderDetail () {
								Id = details[0].Id,
								OrderId = cart.Id,
								ProductId = product.Id,
								Quantity = details[0].Quantity - 1,
								UnitPrice = product.UnitPrice,
								Discount = 0
							});
						}
					}
				}
				
				return ListCarts(repo, 0, 1).FirstOrDefault();
			}
		}
		
		public Cart CreateCart(DateTime cartDate)
		{
			using (var repo = new General())
			{
				var order = repo.Request<Vko.Entities.Order>().Create(new Vko.Entities.Order () {
					CustomerId = "ALFKI",
					EmployeeId = 1,
					OrderDate = DateTime.Now
				});
				
				return new Cart () {
	                Id = order.Id,
	                CartDate = order.OrderDate.ToJSLong(),
					CartDetail = new List<CartDetail>()
				};
			}
		}
		
		private int TotalProducts(General repo)
		{
			return repo.Request<Vko.Entities.Product>().GetCount();
		}
		
		private IEnumerable<Cart> ListCarts(General repo, int from, int count)
		{
            var orders = repo.Request<Vko.Entities.Order>().List(from, count);
			var details = FindCartDetails(repo, new {
				OrderId = new {
					__in = orders.Select(x => x.Id).Distinct().ToArray()
				}
			}).ToList();
			
			foreach (var entity in orders)
			{
				yield return new Cart
				{
	                Id = entity.Id,
	                CartDate = entity.OrderDate.ToJSLong(),
					CartDetail = details
						.Where(x => x.OrderId == entity.Id)
						.ToList()
				};
			}
		}
		
		private int TotalCarts(General repo)
		{
			return repo.Request<Vko.Entities.Order>().GetCount();
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
		
		private IEnumerable<CartDetail> FindCartDetails<T>(General repo, T args)
		{
			var details = repo.Request<Vko.Entities.OrderDetail>().Find(args).ToList();
            var products = FindProducts(repo, new {
				Id = new {
					__in = details.Select(x => x.ProductId).Distinct().ToArray()
				}
			}).ToList();

			foreach (var entity in details)
			{
				yield return new CartDetail
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