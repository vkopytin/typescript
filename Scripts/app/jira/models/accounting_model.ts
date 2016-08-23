/// <reference path="../base/model_base.ts" />
import _ = require('underscore');
import $ = require('jquery');
import ModelBase = require('app/jira/base/model_base');

var fetchProductsXhr: JQueryPromise<any> = null,
    saveProductXhr: JQueryPromise<any> = null,
    fetchCategoriesXhr: JQueryPromise<any> = null,
    fetchSupppliersXhr: JQueryPromise<any> = null,
    fetchOrdersXhr: JQueryPromise<any> = null,
    inst: AccountingModel;
    
class AccountingModel extends ModelBase {
    products: any[] = []
    product: any = {}
    categories: any[] = []
    suppliers: any[] = []
    orders: any[] = []

    getProducts () {
        return this.products;
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
    
    fetchProducts (): void {
        fetchProductsXhr = $.when(fetchProductsXhr).then(() => {
            return $.ajax({
                url: '/jira/products',
                type: 'GET',
                data: {},
                success: (items, success, xhr) => {
                    this.setProducts(items);
                }
            });
        });
        fetchProductsXhr.fail(() => {
            fetchProductsXhr = null;
        });
    }
    
    fetchCategories (): void {
        fetchCategoriesXhr = $.when(fetchCategoriesXhr).then(() => {
            return $.ajax({
                url: '/jira/categories',
                type: 'GET',
                data: {},
                success: (items, success, xhr) => {
                    this.setCategories(items);
                }
            });
        });
        fetchCategoriesXhr.fail(() => {
            fetchCategoriesXhr = null;
        });
    }

    fetchSuppliers (): void {
        fetchSupppliersXhr = $.when(fetchSupppliersXhr).then(() => {
            return $.ajax({
                url: '/jira/suppliers',
                type: 'GET',
                data: {},
                success: (items, success, xhr) => {
                    this.setSuppliers(items);
                }
            });
        });
        fetchSupppliersXhr.fail(() => {
            fetchSupppliersXhr = null;
        });
    }
    
    fetchOrders (): void {
        fetchOrdersXhr = $.when(fetchOrdersXhr).then(() => {
            return $.ajax({
                url: '/jira/orders',
                type: 'GET',
                data: {},
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
    
	static getCurent (): AccountingModel {
        if (inst) {
            return inst;
        }
        
        inst = new AccountingModel({});
        
        return inst;
    }
}

export = AccountingModel;