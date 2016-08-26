/// <reference path="../base/model_base.ts" />
import _ = require('underscore');
import $ = require('jquery');
import ModelBase = require('app/jira/base/model_base');

var fetchProductsXhr: JQueryPromise<any> = null,
    saveProductXhr: JQueryPromise<any> = null,
    saveOrderXhr: JQueryPromise<any> = null,
    fetchCategoriesXhr: JQueryPromise<any> = null,
    fetchSupppliersXhr: JQueryPromise<any> = null,
    fetchOrdersXhr: JQueryPromise<any> = null,
    inst: AccountingModel;
    
class AccountingModel extends ModelBase {
    products: any[] = []
    productsTotal: number = 0
    product: any = {}
    categories: any[] = []
    suppliers: any[] = []
    orders: any[] = []

    getProducts () {
        return this.products;
    }
    
    getProductsTotal() {
        return this.productsTotal;
    }
    
    setProducts (value: any[]): void {
        this.products = value;
        this.triggerProperyChanged('accounting_model.products');
    }
    
    getCategories () {
        return this.categories;
    }
    
    setCategories (value: any[]): void {
        this.categories = value;
        this.triggerProperyChanged('accounting_model.categories');
    }

    getSuppliers () {
        return this.suppliers;
    }
    
    setSuppliers (value: any[]): void {
        this.suppliers = value;
        this.triggerProperyChanged('accounting_model.suppliers');
    }
    
    getOrders () {
        return this.orders;
    }
    
    setOrders (value: any[]): void {
        this.orders = value;
        this.triggerProperyChanged('accounting_model.orders');
    }

    getProduct () {
        return this.product;
    }
    
    setProduct (product: any): void {
        this.product = product;
        this.triggerProperyChanged('accounting_model.product');
    }
    
    fetchProducts (from: number=0, count: number=10): void {
        fetchProductsXhr = $.when(fetchProductsXhr).then(() => {
            return $.ajax({
                url: '/jira/products',
                type: 'GET',
                data: {from: from, count: count},
                success: (result, success, xhr) => {
                    this.productsTotal = result.Total;
                    this.setProducts(result.Items);
                }
            });
        });
        fetchProductsXhr.fail(() => {
            fetchProductsXhr = null;
        });
    }
    
    fetchCategories (from: number=0, count: number=10): void {
        fetchCategoriesXhr = $.when(fetchCategoriesXhr).then(() => {
            return $.ajax({
                url: '/jira/categories',
                type: 'GET',
                data: {from: from, count: count},
                success: (items, success, xhr) => {
                    this.setCategories(items);
                }
            });
        });
        fetchCategoriesXhr.fail(() => {
            fetchCategoriesXhr = null;
        });
    }

    fetchSuppliers (from: number=0, count: number=10): void {
        fetchSupppliersXhr = $.when(fetchSupppliersXhr).then(() => {
            return $.ajax({
                url: '/jira/suppliers',
                type: 'GET',
                data: {from: from, count: count},
                success: (items, success, xhr) => {
                    this.setSuppliers(items);
                }
            });
        });
        fetchSupppliersXhr.fail(() => {
            fetchSupppliersXhr = null;
        });
    }
    
    fetchOrders (from: number=0, count: number=10): void {
        fetchOrdersXhr = $.when(fetchOrdersXhr).then(() => {
            return $.ajax({
                url: '/jira/orders',
                type: 'GET',
                data: {from: from, count: count},
                success: (items, success, xhr) => {
                    this.setOrders(items);
                }
            });
        });
        fetchOrdersXhr.fail(() => {
            fetchOrdersXhr = null;
        });
    }
    
    saveProduct (product: any): any {
        saveProductXhr = $.when(saveProductXhr).then(() => {
            return $.ajax({
                url: '/jira/products/' + product.Id,
                type: 'POST',
                data: product,
                success: (item, success, xhr) => {
                    this.setProduct(item);
                }
            });
        });
        saveProductXhr.fail(() => {
            saveProductXhr = null;
        });
    }
    
    searchProducts (subject: string): void {
        fetchOrdersXhr = $.when(fetchOrdersXhr).then(() => {
            return $.ajax({
                url: '/jira/products',
                type: 'GET',
                data: {search: subject},
                success: (result, success, xhr) => {
                    this.productsTotal = result.Total;
                    this.setProducts(result.Items);
                }
            });
        });
        fetchOrdersXhr.fail(() => {
            fetchOrdersXhr = null;
        });
    }
    
    addToCart (productId: any, price: number) {
        saveOrderXhr = $.when(saveOrderXhr).then(() => {
            return $.ajax({
                url: '/jira/orders/',
                type: 'POST',
                data: { productId: productId, price: price },
                success: (item, success, xhr) => {
                    this.setProduct(item);
                }
            });
        });
        saveOrderXhr.fail(() => {
            saveOrderXhr = null;
        });
    }
    
	static getCurent (): AccountingModel {
        if (inst) {
            return inst;
        }
        
        inst = new AccountingModel({});
        
        return inst;
    }
}

export = AccountingModel;