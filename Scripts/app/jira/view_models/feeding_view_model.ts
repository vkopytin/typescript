/// <reference path="../../../vendor.d.ts" />
/// <reference path="../command.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../utils.ts" />
/// <reference path="page_view_model.ts" />
/// <reference path="filter_entry_view_model.ts" />
/// <reference path="filter_epic_view_model.ts" />
/// <reference path="issue_entry_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import PageViewModel = require('app/jira/view_models/page_view_model');
import ProductEntryViewModel = require('app/jira/view_models/product_entry_view_model');
import Command = require('app/jira/command');
import Model = require('app/jira/models/accounting_model');
import Utils = require('app/jira/utils');
        
class FeedingViewModel extends PageViewModel {
    changeProductsDelegate: any
    
    products: ProductEntryViewModel[] = []
    
    getProducts (): any {
        return this.products;
    }
    
    setProducts (value: ProductEntryViewModel[]) : void {
        var products = this.products;
        _.defer(() => {
            _.each(products, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.products = value;
        this.triggerProperyChanged('change:products');
    }
    
    init (opts: any): void {
        var model = Model.getCurrent();
        super.init(opts);
        
        _.each({
            'accounting_model.products': this.changeProductsDelegate = _.bind(this.changeProducts, this)
        }, (h, e) => { $(model).on(e, h); });
        
        _.defer(_.bind(() => {
            this.fetchProducts();
        }, this), 0);
    }
    
    finish () : void {
        var model = Model.getCurrent();
        _.each({
            'accounting_model.products': this.changeProductsDelegate
        }, (h, e) => { $(model).off(e, h); });
        
        $(this).off();
        
        this.setProducts([]);
        
        super.finish();
    }
    
    changeProducts (): void {
        var model = Model.getCurrent(),
            issues = model.getProducts();
            
        this.setProducts(_.map(issues, (item) => {
            return new ProductEntryViewModel(item);
        }, this));
    }
    
    fetchProducts (): void {
        var model = Model.getCurrent();
        model.fetchProducts();
    }
}

export = FeedingViewModel;