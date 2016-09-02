using System;
using System.Collections.Generic;
using System.Linq;

using System.Data.SQLite;

using Vko.Repository;
using Vko.Services.Entities;


namespace Vko.Services.Impl
{
	public class ProductsService: IProductsService
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

		public IEnumerable<Supplier> ListSuppliers(int from=0, int count=10)
		{
			using (var repo = new General())
			{
				return ListSuppliers(repo, from, count).ToList();
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
		
		public IEnumerable<Product> FindProducts<T>(T args)
		{
			using (var repo = new General())
			{
				var items = FindProducts(repo, args).ToList();
				return items;
			}
		}

		public IEnumerable<Supplier> FindSuppliers<T>(T args)
		{
			using (var repo = new General())
			{
				var items = FindSuppliers(repo, args).ToList();
				return items;
			}
		}
		
		public IEnumerable<Category> FindCategories<T>(T args)
		{
			using (var repo = new General())
			{
				var items = FindCategories(repo, args).ToList();
				return items;
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
		
		public Product CreateProduct(Product product)
		{
			using (var repo = new General())
			{
				var productsRepo = repo.Make<IProductsRepository<Product>>();
				var existingProduct = productsRepo.GetById(product.Id);
				if (existingProduct != null)
				{
					throw new Exception(string.Format("Product with same Id: '{0}' already exists", product.Id));
				}
				var newProd = productsRepo.Create(product);
				
				return FindProducts(repo, new {
					Id = newProd.Id
				}).FirstOrDefault();
			}
		}
		
		public Product UpdateProduct(Product product)
		{
			using (var repo = new General())
			{
				var productsRepo = repo.Make<IProductsRepository<Product>>();
				var existingProduct = productsRepo.GetById(product.Id);
				if (existingProduct == null)
				{
					throw new Exception(string.Format("Product with Id: '{0}' doesn't exist", product.Id));
				}
				productsRepo.Update(product.Id, product);
				
				return FindProducts(repo, new {
					Id = product.Id
				}).FirstOrDefault();
			}
		}
		
		public Supplier CreateSupplier(Supplier supplier)
		{
			using (var repo = new General())
			{
				var suppliersRepo = repo.Make<ISuppliersRepository<Supplier>>();
				var existing = suppliersRepo.GetById(supplier.Id);
				if (existing != null)
				{
					throw new Exception(string.Format("Product with same Id: '{0}' already exists", supplier.Id));
				}
				var newSup = suppliersRepo.Create(supplier);
				
				return FindSuppliers(repo, new {
					Id = newSup.Id
				}).FirstOrDefault();
			}
		}
		
		public Supplier UpdateSupplier(Supplier supplier)
		{
			using (var repo = new General())
			{
				var suppliersRepo = repo.Make<ISuppliersRepository<Supplier>>();
				var existing = suppliersRepo.GetById(supplier.Id);
				if (existing == null)
				{
					throw new Exception(string.Format("Product with Id: '{0}' doesn't exist", supplier.Id));
				}
				suppliersRepo.Update(supplier.Id, supplier);
				
				return FindSuppliers(repo, new {
					Id = supplier.Id
				}).FirstOrDefault();
			}
		}
					
		public Category CreateCategory(Category category)
		{
			using (var repo = new General())
			{
				var categoriesRepo = repo.Make<ICategoriesRepository<Category>>();
				var existing = categoriesRepo.GetById(category.Id);
				if (existing != null)
				{
					throw new Exception(string.Format("Product with same Id: '{0}' already exists", category.Id));
				}
				var newCat = categoriesRepo.Create(category);
				
				return FindCategories(repo, new {
					Id = newCat.Id
				}).FirstOrDefault();
			}
		}
		
		public Category UpdateCategory(Category category)
		{
			using (var repo = new General())
			{
				var categoriesRepo = repo.Make<ICategoriesRepository<Category>>();
				var existing = categoriesRepo.GetById(category.Id);
				if (existing == null)
				{
					throw new Exception(string.Format("Product with Id: '{0}' doesn't exist", category.Id));
				}
				categoriesRepo.Update(category.Id, category);
				
				return FindCategories(repo, new {
					Id = category.Id
				}).FirstOrDefault();
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
	            var orders = repo.Make<IOrdersRepository<Order>>().List(from, count);
				var details = FindOrderDetails(repo, new {
					OrderId = new {
						__in = orders.Select(x => x.Id).Distinct().ToArray()
					}
				}).ToList();
				
				foreach (var entity in orders)
				{
					entity.OrderDetail = details
						.Where(x => x.OrderId == entity.Id)
						.ToList();
						
					yield return entity;
				}
			}
		}
		
		public Cart AddToCart(int productId, decimal price)
		{
			using (var repo = new General())
			{
				var product = repo.Make<IProductsRepository<Product>>().GetById(productId);
				var orderDetailsRepo = repo.Make<IOrderDetailsRepository<OrderDetail>>();
				if (product == null)
				{
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
					if (details.Count == 0)
					{
						var newDetail = orderDetailsRepo.Create(new OrderDetail () {
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
						var existingDetail = orderDetailsRepo.Update(details[0].Id, new OrderDetail () {
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
				var product = repo.Make<IProductsRepository<Product>>().GetById(productId);
				var orderDetailsRepo = repo.Make<IOrderDetailsRepository<OrderDetail>>();
				if (product == null)
				{
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
							var existingDetail = orderDetailsRepo.Update(details[0].Id, new OrderDetail () {
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
				var order = repo.Make<IOrdersRepository<Order>>().Create(new Order () {
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
		
		public IEnumerable<Category> ListCategories(int from=0, int count=10)
		{
			using (var repo = new General())
			{
				return ListCategories(repo, from, count).ToList();
			}
		}
		
		public IEnumerable<object> Report()
		{
			using (var conn = new SQLiteConnection(Config.DefaultDB))
			{
				conn.Open();
	            string strSql = @"SELECT
					SUM(od.UnitPrice * od.Quantity) AS Total,
					'All Products' AS ProductName,
					SUM(od.Quantity) AS Quantity,
					strftime('%m-%Y', o.OrderDate) AS Month,
					o.OrderDate AS Date,
					100 AS seed
					FROM [Order] o, OrderDetail od, Product p, Supplier s
					WHERE o.Id = od.OrderId AND p.Id = od.ProductId AND s.Id = p.SupplierId
					 AND o.OrderDate > '2016-01-01'
					GROUP BY Month

					UNION SELECT
					SUM(od.UnitPrice * od.Quantity) AS Total,
					c.CategoryName AS ProductName,
					SUM(od.Quantity) AS Quantity,
					strftime('%m-%Y', o.OrderDate) AS Month,
					o.OrderDate AS Date,
					90 AS seed
					FROM [Order] o, OrderDetail od, Product p, Category c
					WHERE o.Id = od.OrderId AND p.Id = od.ProductId AND c.Id = p.CategoryId
					 AND o.OrderDate > '2016-01-01'
					GROUP BY Month, c.CategoryName

					UNION SELECT
					SUM(od.UnitPrice * od.Quantity) AS Total,
					s.CompanyName AS ProductName,
					SUM(od.Quantity) AS Quantity,
					strftime('%m-%Y', o.OrderDate) AS Month,
					o.OrderDate AS Date,
					80 AS seed
					FROM [Order] o, OrderDetail od, Product p, Supplier s
					WHERE o.Id = od.OrderId AND p.Id = od.ProductId AND s.Id = p.SupplierId
					 AND o.OrderDate > '2016-01-01'
					GROUP BY Month, s.CompanyName
					
					UNION SELECT
					SUM(od.UnitPrice * od.Quantity) AS Total,
					p.ProductName AS ProductName,
					SUM(od.Quantity) AS Quantity,
					'2016-01' AS Month,
					'2016-01-01 10:00:00' AS Date,
					70 AS seed
					FROM [Order] o, OrderDetail od, Product p, Supplier s
					WHERE o.Id = od.OrderId AND p.Id = od.ProductId AND s.Id = p.SupplierId
					 AND o.OrderDate > '2016-01-01'
					GROUP BY Month, od.ProductId
					ORDER BY seed DESC, Date DESC, Total DESC, Quantity DESC
					";
					
	            using (SQLiteCommand command = new SQLiteCommand(strSql, conn))
	            {
	                using(SQLiteDataReader reader = command.ExecuteReader())
	                {
	                    while (reader.Read())
	                    {
	                        yield return new {
								Month = Convert.ToString(reader["Month"]),
								ProductName = Convert.ToString(reader["ProductName"]),
								Quantity = Convert.ToString(reader["Quantity"]),
								Total = Convert.ToString(reader["Total"])
							};
	                    }
	                }
	            }
			}
		}
		
		private int TotalProducts(General repo)
		{
			return repo.Make<IProductsRepository<Product>>().GetCount();
		}
		
		private IEnumerable<Cart> ListCarts(General repo, int from, int count)
		{
            var orders = repo.Make<IOrdersRepository<Order>>().List(from, count);
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
			return repo.Make<IOrdersRepository<Order>>().GetCount();
		}
		
		private IEnumerable<Category> ListCategories(General repo, int from=0, int count=10)
		{
			var categories = repo.Make<ICategoriesRepository<Category>>().List(from, count);

			return categories;
		}

		private IEnumerable<Product> ListProducts(General repo, int from=0, int count=10)
		{
            var products = repo.Make<IProductsRepository<Product>>().List(from, count);

			var categories = repo.Make<ICategoriesRepository<Category>>().Find(new {
				Id = new {
					__in = products.Select(x => x.CategoryId).Distinct().ToArray()
				}
			}).ToList();
			var suppliers = repo.Make<ISuppliersRepository<Supplier>>().Find(new {
				Id = new {
					__in = products.Select(x => x.SupplierId).Distinct().ToArray()
				}
			}).ToList();
			
			foreach (var entity in products)
			{
				entity.Category = categories.FirstOrDefault(x => x.Id == entity.CategoryId);
				entity.Supplier = suppliers.FirstOrDefault(x => x.Id == entity.SupplierId);
				
				yield return entity;
			}
		}
		
		private IEnumerable<Supplier> ListSuppliers(General repo, int from=0, int count=10)
		{
            var suppliers = repo.Make<ISuppliersRepository<Supplier>>().List(from, count);
			
			return suppliers;
		}

		private IEnumerable<Product> FindProducts<T>(General repo, T args)
		{
            var products = repo.Make<IProductsRepository<Product>>().Find(args);

			var categories = repo.Make<ICategoriesRepository<Category>>().Find(new {
				Id = new {
					__in = products.Select(x => x.CategoryId).Distinct().ToArray()
				}
			}).ToList();
			var suppliers = repo.Make<ISuppliersRepository<Supplier>>().Find(new {
				Id = new {
					__in = products.Select(x => x.SupplierId).Distinct().ToArray()
				}
			}).ToList();
			
			foreach (var entity in products)
			{
				entity.Category = categories.FirstOrDefault(x => x.Id == entity.CategoryId);
				entity.Supplier = suppliers.FirstOrDefault(x => x.Id == entity.SupplierId);

				yield return entity;
			}
		}
		
		private IEnumerable<Supplier> FindSuppliers<T>(General repo, T args)
		{
			var suppliers = repo.Make<ISuppliersRepository<Supplier>>().Find(args);
			
			foreach (var entity in suppliers)
			{
				yield return new Supplier
				{
                    Id = entity.Id,
                    CompanyName = entity.CompanyName,
                    ContactName = entity.ContactName,
                    ContactTitle = entity.ContactTitle,
                    Address = entity.Address,
                    City = entity.City
				};
			}
		}

		private IEnumerable<Category> FindCategories<T>(General repo, T args)
		{
			var categories = repo.Make<ICategoriesRepository<Category>>().Find(args);
			
			foreach (var entity in categories)
			{
				yield return entity;
			}
		}

		private IEnumerable<OrderDetail> ListOrderDetails(General repo, int from=0, int count=10)
		{
			var details = repo.Make<IOrderDetailsRepository<OrderDetail>>().List(from, count);
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
			var details = repo.Make<IOrderDetailsRepository<OrderDetail>>().Find(args).ToList();
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
			var details = repo.Make<IOrderDetailsRepository<OrderDetail>>().Find(args).ToList();
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