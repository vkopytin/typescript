/// <reference path="../base/model_base.ts" />
import _ = require('underscore');
import $ = require('jquery');
import ModelBase = require('app/jira/base/model_base');

var fetchProductsXhr: JQueryPromise<any> = null,
    inst: AccountingModel;
    
class AccountingModel extends ModelBase {
    products: any[] = []

    getProducts () {
        return this.products;
    }
    
    setProducts (value: any[]): void {
        this.products = value;
        this.triggerProperyChanged('accounting_model.products');
    }
    
    fetchProducts (): void {
        fetchProductsXhr = $.when(fetchProductsXhr).then(() => {
            return $.ajax({
                url: '/jira/schedule',
                type: 'GET',
                data: {},
                success: (items, success, xhr) => {
                    this.setProducts(items);
                }
            });
        }, () => {
            fetchProductsXhr = null;
        });
    }
    
	static getCurrent (): AccountingModel {
        if (inst) {
            return inst;
        }
        
        inst = new AccountingModel({});
        
        return inst;
    }
}

export = AccountingModel;