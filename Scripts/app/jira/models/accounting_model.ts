/// <reference path="../base/model_base.ts" />
import _ = require('underscore');
import $ = require('jquery');
import ModelBase = require('app/jira/base/model_base');

var fetchProductsXhr: JQueryPromise<any> = null,
    saveProductXhr: JQueryPromise<any> = null,
    inst: AccountingModel;
    
class AccountingModel extends ModelBase {
    products: any[] = []
    product: any = {}

    getProducts () {
        return this.products;
    }
    
    setProducts (value: any[]): void {
        this.products = value;
        this.triggerProperyChanged('accounting_model.products');
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