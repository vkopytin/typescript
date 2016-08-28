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
        
        this.state = {
            category: this.props.viewModel
        };
    }
    
    setCategory () {
        this.setState({
            category: this.props.viewModel
        });
    }
    
    componentWillMount () {
        _.each('change:CategoryName change:Description'.split(' '), (en) => {
            $(this.props.viewModel).on(en, _.bind(this.setCategory, this));
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
            $(props.viewModel).on(en, _.bind(this.setCategory, this));
        });
    }
    
    onClick (evnt: any): any {
        evnt.preventDefault();
        this.props.onSelect && this.props.onSelect();
    }
    
    updateCategoryName (evnt: any) {
        evnt.preventDefault();
        var val = $(evnt.target).text();
        
        this.setState({
            category: this.state.category.setCategoryName(val)
        });
    }
    
    updateDescription (evnt: any) {
        evnt.preventDefault();
        var val = $(evnt.target).text();
        
        this.setState({
            category: this.state.category.setDescription(val)
        });
    }
    
    saveCategory (evnt: any) {
        evnt.preventDefault();
        
        this.props.viewModel.saveCategory();
    }

    render () {
        
        return template.call(this, this.props.viewModel);
    }
}

export = CategoryItemView;