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

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            product: this.props.viewModel
        };
    }
    
    setProduct () {
        this.setState({
            product: this.props.viewModel
        });
    }
    
    componentWillMount () {
        _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit'.split(' '), (en) => {
            $(this.props.viewModel).on(en, _.bind(this.setProduct, this));
        });
    }
    
    componentWillUnmount () {
        _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit'.split(' '), (en) => {
            $(this.props.viewModel).off(en);
        });
    }
    
    componentWillReceiveProps (props: IProductItemView) {
        _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit'.split(' '), (en) => {
            $(this.props.viewModel).off(en);
            $(props.viewModel).on(en, _.bind(this.setProduct, this));
        });
    }
    
    onClick (evnt: any): any {
        evnt.preventDefault();
        this.props.onSelect && this.props.onSelect();
    }
    
    render () {
        
        return template.call(this, this.props.viewModel);
    }
    
    addToCart(evnt: any) {
        var vm: any = this.props.viewModel;
        this.props.viewModel.addToCart(
            vm.getId(),
            vm.getUnitPrice()
        );
    }
}

export = ProductItemView;