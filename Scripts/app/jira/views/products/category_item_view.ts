import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import ProductEntryViewModel = require('app/jira/view_models/products/category_entry_view_model');
import template = require('app/jira/templates/products/category_item_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IProductItemView {
    viewModel: ProductEntryViewModel
    onSelect?: Function
}

class CategoryItemView extends BaseView<ProductEntryViewModel, IProductItemView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = this.props.viewModel;
    }
    
    setProduct () {
        this.setState(this.props.viewModel);
    }
    
    componentWillMount () {
        _.each('change:CategoryName change:Description'.split(' '), (en) => {
            $(this.props.viewModel).on(en, _.bind(this.setProduct, this));
        });
    }
    
    componentWillUnmount () {
        _.each('change:CategoryName change:Description'.split(' '), (en) => {
            $(this.props.viewModel).off(en);
        });
    }
    
    componentWillReceiveProps (props: IProductItemView) {
        _.each('change:CategoryName change:Description'.split(' '), (en) => {
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
}

export = CategoryItemView;