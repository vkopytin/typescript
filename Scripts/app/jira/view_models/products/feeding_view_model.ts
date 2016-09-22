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
import SupplierEntryViewModel = require('app/jira/view_models/products/supplier_entry_view_model');
import OrderEntryViewModel = require('app/jira/view_models/products/order_entry_view_model');
import CartEntryViewModel = require('app/jira/view_models/products/cart_entry_view_model');
import Command = require('app/jira/command');
import Model = require('app/jira/models/accounting_model');
import Utils = require('app/jira/utils');


class FeedingViewModel extends PageViewModel {
    changeProductsDelegate: any
    changeCategoriesDelegate: any
    changeSuppliersDelegate: any
    changeOrdersDelegate: any
    changeProductDelegate: any
    changeCartsDelegate: any
    changeReportDelegate: any
    
    SelectCommand: Command
    
    curentProduct: ProductEntryViewModel = new ProductEntryViewModel({
        Id: 0,
        Category: { Id: 1},
        Supplier: { Id: 1}
    })
        
    products: ProductEntryViewModel[] = []
    productsTotal: number = 0
    categories: CategoryEntryViewModel[] = []
    suppliers: SupplierEntryViewModel[] = []
    orders: OrderEntryViewModel[] = []
    carts: CartEntryViewModel[] = []
    report: any = {}
    
    getCurentProduct (): any {
        return this.curentProduct;
    }
    
    setCurentProduct (value: ProductEntryViewModel): any {
        this.curentProduct = value;
        this.triggerProperyChanged('change:CurentProduct');
        this.onPropertyChange('CurentProduct', value);
    }
    
    getProducts (): any {
        return this.products;
    }
    
    setProducts (value: ProductEntryViewModel[]) : void {
        var entries = this.products;
        _.defer(() => {
            _.each(entries, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.products = value;
        this.triggerProperyChanged('change:products');
        this.onPropertyChange('Products', value);
    }
    
    getProductsTotal () {
        return this.productsTotal;
    }
    
    setProductsTotal (value: number): void {
        this.productsTotal = value;
    }
    
    getCategories (): any {
        return this.categories;
    }
    
    setCategories (value: CategoryEntryViewModel[]) : void {
        var entries = this.categories;
        _.defer(() => {
            _.each(entries, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.categories = value;
        this.triggerProperyChanged('change:categories');
        this.onPropertyChange('Categories', value);
    }
    
    getSuppliers (): any {
        return this.suppliers;
    }
    
    setSuppliers (value: SupplierEntryViewModel[]) : void {
        var entries = this.suppliers;
        _.defer(() => {
            _.each(entries, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.suppliers = value;
        this.triggerProperyChanged('change:suppliers');
        this.onPropertyChange('Suppliers', value);
    }

    getOrders (): any {
        return this.orders;
    }
    
    setOrders (value: OrderEntryViewModel[]) : void {
        var entries = this.orders;
        _.defer(() => {
            _.each(entries, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.orders = value;
        this.triggerProperyChanged('change:orders');
        this.onPropertyChange('Orders', value);
    }
    
    getCarts (): any {
        return this.carts;
    }
    
    setCarts (value: CartEntryViewModel[]) : void {
        var entries = this.carts;
        _.defer(() => {
            _.each(entries, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.carts = value;
        this.triggerProperyChanged('change:carts');
        this.onPropertyChange('Carts', value);
    }
    
    getCart (): any {
        return _.first(this.carts);
    }
    
    getReport () {
        return this.report;
    }
    
    setReport (value: any) : void {
        this.report = value;
        this.triggerProperyChanged('change:report');
        this.onPropertyChange('Report', value);
    }

    init (opts: any): void {
        var model = Model.getCurent();
        super.init(opts);
        
        this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
        
        _.each({
            'accounting_model.products': this.changeProductsDelegate = _.bind(this.changeProducts, this),
            'accounting_model.categories': this.changeCategoriesDelegate = _.bind(this.changeCategories, this),
            'accounting_model.suppliers': this.changeSuppliersDelegate = _.bind(this.changeSuppliers, this),
            'accounting_model.orders': this.changeOrdersDelegate = _.bind(this.changeOrders, this),
            'accounting_model.product': this.changeProductDelegate = _.bind(this.changeProduct, this),
            'accounting_model.carts': this.changeCartsDelegate = _.bind(this.changeCarts, this),
            'accounting_model.report': this.changeReportDelegate = _.bind(this.changeReport, this)
        }, (h, e) => { $(model).on(e, h); });
        
        _.defer(_.bind(() => {
            this.fetchProducts();
            this.fetchCategories();
            this.fetchSuppliers();
            this.fetchOrders();
            this.fetchCarts();
            this.fetchReport();
        }, this), 0);
    }
    
    finish () : void {
        var model = Model.getCurent();
        _.each({
            'accounting_model.products': this.changeProductsDelegate,
            'accounting_model.categories': this.changeCategoriesDelegate,
            'accounting_model.suppliers': this.changeSuppliersDelegate,
            'accounting_model.orders': this.changeOrdersDelegate,
            'accounting_model.product': this.changeProductDelegate,
            'accounting_model.carts': this.changeCartsDelegate,
            'accounting_model.report': this.changeReportDelegate
        }, (h, e) => { $(model).off(e, h); });
        
        $(this).off();
        
        this.setProducts([]);
        this.setCategories([]);
        this.setSuppliers([]);
        this.setOrders([]);
        this.setCarts([]);
        
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
    
    newProduct () {
        this.setCurentProduct(new ProductEntryViewModel({
            Id: 0,
            Category: { Id: 1},
            Supplier: { Id: 1}
        }));
    }
    
    onChangeSelected (commandName: string, productId: any): any {
        var product = _.find(this.products, (entity) => entity.getId() === productId);
        product && this.setCurentProduct(product);
    }
    
    changeProducts (): void {
        var model = Model.getCurent(),
            items = model.getProducts(),
            total = model.getProductsTotal();
            
        this.setProductsTotal(total);
        this.setProducts(_.map(items, (item) => {
            return new ProductEntryViewModel(item);
        }, this));
    }

    changeCategories (): void {
        var model = Model.getCurent(),
            items = model.getCategories();
            
        items.push({Id: 0});

        this.setCategories(_.map(items, (item) => {
            return new CategoryEntryViewModel(item);
        }, this));
    }

    changeSuppliers (): void {
        var model = Model.getCurent(),
            items = model.getSuppliers();
            
        this.setSuppliers(_.map(items, (item) => {
            return new SupplierEntryViewModel(item);
        }, this));
    }
    
    changeOrders (): void {
        var model = Model.getCurent(),
            items = model.getOrders();
            
        this.setOrders(_.map(items, (item) => {
            return new OrderEntryViewModel(item);
        }, this));
    }

    changeProduct (): void {
        var model = Model.getCurent();
        var product = this.getCurentProduct();
        product.setData(model.getProduct());
        this.setCurentProduct(product);
    }
    
    changeCarts (): void {
        var model = Model.getCurent(),
            items = model.getCarts();
            
        this.setCarts(_.map(items, (item) => {
            return new CartEntryViewModel(item);
        }, this));
    }
    
    createCart (): void {
        var model = Model.getCurent();
        model.createCart();
    }
    
    changeReport (): void {
        var model = Model.getCurent();
        this.setReport(model.getReport());
    }

    fetchProducts (from=0, count=10): void {
        var model = Model.getCurent();
        model.fetchProducts(from, count);
    }
    
    fetchCategories (): void {
        var model = Model.getCurent();
        model.fetchCategories(0, 100);
    }

    fetchSuppliers (): void {
        var model = Model.getCurent();
        model.fetchSuppliers(0, 100);
    }
    
    fetchOrders (): void {
        var model = Model.getCurent();
        model.fetchOrders(0, 10);
    }

    saveCurentProduct (): void {
        var model = Model.getCurent();
        model.saveProduct(this.curentProduct.toJSON());
    }
    
    searchProducts (subject: string): void {
        var model = Model.getCurent();
        model.searchProducts(subject);
    }

    fetchCarts (from=0, count=10): void {
        var model = Model.getCurent();
        model.fetchCarts(from, count);
    }
    
    fetchReport (from=0, count=10): void {
        var model = Model.getCurent();
        model.fetchReport(from, count);
    }
}

export = FeedingViewModel;