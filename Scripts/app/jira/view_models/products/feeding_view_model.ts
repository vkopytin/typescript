/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../command.ts" />
/// <reference path="../../models/model.ts" />
/// <reference path="../../utils.ts" />
/// <reference path="../page_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import PageViewModel = require('app/jira/view_models/page_view_model');
import ProductEntryViewModel = require('app/jira/view_models/products/product_entry_view_model');
import CategoryEntryViewModel = require('app/jira/view_models/products/category_entry_view_model');
import Command = require('app/jira/command');
import Model = require('app/jira/models/accounting_model');
import Utils = require('app/jira/utils');
        
class FeedingViewModel extends PageViewModel {
    changeProductsDelegate: any
    changeCategoriesDelegate: any
    changeProductDelegate: any
    
    SelectCommand: Command
    
    curentProduct: ProductEntryViewModel = new ProductEntryViewModel({
        id: -1,
        code: 'Dummy Code.',
        user: 'Dummy User.',
        Description: 'Dummy Description.'
    })
        
    products: ProductEntryViewModel[] = []
    categories: CategoryEntryViewModel[] = []
    
    getCurentProduct (): any {
        return this.curentProduct;
    }
    
    setCurentProduct (value: ProductEntryViewModel): any {
        this.curentProduct = value;
        this.triggerProperyChanged('change:CurentProduct');
    }
    
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
    
    getCategories (): any {
        return this.categories;
    }
    
    setCategories (value: CategoryEntryViewModel[]) : void {
        var categories = this.categories;
        _.defer(() => {
            _.each(categories, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.categories = value;
        this.triggerProperyChanged('change:categories');
    }
    
    init (opts: any): void {
        var model = Model.getCurent();
        super.init(opts);
        
        this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
        
        _.each({
            'accounting_model.products': this.changeProductsDelegate = _.bind(this.changeProducts, this),
            'accounting_model.categories': this.changeCategoriesDelegate = _.bind(this.changeCategories, this),
            'accounting_model.product': this.changeProductDelegate = _.bind(this.changeProduct, this)
        }, (h, e) => { $(model).on(e, h); });
        
        _.defer(_.bind(() => {
            this.fetchProducts();
            this.fetchCategories();
        }, this), 0);
    }
    
    finish () : void {
        var model = Model.getCurent();
        _.each({
            'accounting_model.products': this.changeProductsDelegate,
            'accounting_model.categories': this.changeCategoriesDelegate,
            'accounting_model.product': this.changeProductDelegate
        }, (h, e) => { $(model).off(e, h); });
        
        $(this).off();
        
        this.setProducts([]);
        this.setCategories([]);
        
        super.finish();
    }
    
    getCommand (name: string): Command {
        switch (name) {
            case 'SelectCommand':
                return this.SelectCommand;
            default:
                return super.getCommand(name);
        }
    }
    
    onChangeSelected (commandName: string, productId: any): any {
        var product = _.find(this.products, (entity) => entity.getId() === productId);
        product && this.setCurentProduct(product);
    }
    
    changeProducts (): void {
        var model = Model.getCurent(),
            items = model.getProducts();
            
        this.setProducts(_.map(items, (item) => {
            return new ProductEntryViewModel(item);
        }, this));
    }

    changeCategories (): void {
        var model = Model.getCurent(),
            items = model.getCategories();
            
        this.setCategories(_.map(items, (item) => {
            return new CategoryEntryViewModel(item);
        }, this));
    }
    
    changeProduct (): void {
        var model = Model.getCurent();
        var product = this.getCurentProduct();
        product.setData(model.getProduct());
        this.setCurentProduct(product);
    }
    
    fetchProducts (): void {
        var model = Model.getCurent();
        model.fetchProducts();
    }
    
    fetchCategories (): void {
        var model = Model.getCurent();
        model.fetchCategories();
    }
    
    saveCurentProduct (): void {
        var model = Model.getCurent();
        model.saveProduct(this.curentProduct.toJSON());
    }
}

export = FeedingViewModel;