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
    setProductDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            product: this.props.viewModel
        };
        
        this.setProductDelegate = _.bind(this.setProduct, this);
    }
    
    setProduct () {
        this.setState({
            product: this.props.viewModel
        });
    }
    
    attachEvents (viewModel: any) {
        _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit change:Categorie change:Supplier'.split(' '), (en) => {
            $(viewModel).on(en, _.bind(this.setProduct, this));
        });
    }
    
    deattachEvents (viewModel: any) {
        _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit change:Categorie change:Supplier'.split(' '), (en) => {
            $(viewModel).off(en);
        });
    }
    
    componentWillMount () {
        this.attachEvents(this.props.viewModel);
    }
    
    componentWillUnmount () {
        this.deattachEvents(this.props.viewModel);
    }
    
    componentWillReceiveProps (props: IProductItemView) {
        this.deattachEvents(this.props.viewModel);
        this.attachEvents(props.viewModel);
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