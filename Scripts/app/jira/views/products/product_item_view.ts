import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import ProductEntryViewModel = require('app/jira/view_models/products/product_entry_view_model');
import template = require('app/jira/templates/products/product_item_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface IProductItemView {
    viewModel: ProductEntryViewModel
    onSelect?: Function
}

class ProductItemView extends BaseView<ProductEntryViewModel, IProductItemView> {
    setProductDelegate = () => this.setProduct()
    
    setProduct () {
        this.setState({
            product: this.props.viewModel
        });
    }

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            product: this.props.viewModel
        };
    }
    
    attachEvents (viewModel: any) {
        super.attachEvents(viewModel);
        _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit change:Category change:Supplier'.split(' '), (en) => {
            $(viewModel).on(en, this.setProductDelegate);
        });
    }
    
    detachEvents (viewModel: any) {
        super.detachEvents(viewModel);
        _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit change:Category change:Supplier'.split(' '), (en) => {
            $(viewModel).off(en, this.setProductDelegate);
        });
    }
    
    onClick (evnt: any): any {
        evnt.preventDefault();
        evnt.stopPropagation();
        this.props.onSelect && this.props.onSelect();
    }
    
    render () {
        
        return template.call(this, this.props.viewModel);
    }
    
    addToCart(evnt: any) {
        evnt.preventDefault();
        evnt.stopPropagation();
        var vm: any = this.props.viewModel;
        this.props.viewModel.addToCart(
            vm.getId(),
            vm.getUnitPrice()
        );
    }
    
    editProduct(evnt: any) {
        evnt.preventDefault();
        console.log('Selected product');
    }
}

export = ProductItemView;