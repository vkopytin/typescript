using System;
using System.Collections.Generic;
using System.Linq;

using System.Data.SQLite;

using Vko.Services.Entities;


namespace Vko.Services
{
	public interface IProductsService
	{
		PagedResult<Cart> ListCarts(int from=0, int count=0);
		
		IEnumerable<Product> ListProducts(int from=0, int count=10);

		IEnumerable<Supplier> ListSuppliers(int from=0, int count=10);
		
		PagedResult<Product> FindProductsPaged(string search);
		
		IEnumerable<Product> FindProducts<T>(T args);

		IEnumerable<Supplier> FindSuppliers<T>(T args);
		
		IEnumerable<Category> FindCategories<T>(T args);
		
		PagedResult<Product> ListProductsPaged(int from=0, int count=10);
		
		Product CreateProduct(Product product);
		
		Product UpdateProduct(Product product);
		
		Supplier CreateSupplier(Supplier supplier);
		
		Supplier UpdateSupplier(Supplier supplier);
					
		Category CreateCategory(Category category);
		
		Category UpdateCategory(Category category);

		IEnumerable<OrderDetail> ListOrderDetails(int from=0, int count=10);
		
		IEnumerable<Order> ListOrders(int from, int count);
		
		Cart AddToCart(int productId, decimal price);
		
		Cart RemoveFromCart(int productId);
		
		Cart CreateCart(DateTime cartDate);
		
		IEnumerable<Category> ListCategories(int from=0, int count=10);
		
		IEnumerable<object> Report();
	}
}