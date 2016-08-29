import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import CategoryEntryViewModel = require('app/jira/view_models/products/category_entry_view_model');
import template = require('app/jira/templates/products/category_item_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IProductItemView {
    viewModel: CategoryEntryViewModel
    onSelect?: Function
}

class CategoryItemView extends BaseView<CategoryEntryViewModel, IProductItemView> {
    setCategoryDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            category: this.props.viewModel
        };
        
        this.setCategoryDelegate = _.bind(this.setCategory, this);
    }
    
    setCategory () {
        this.setState({
            category: this.props.viewModel
        });
    }
    
    attachEvents (viewModel: CategoryEntryViewModel) {
        _.each('change:CategoryName change:Description'.split(' '), (en) => {
            $(viewModel).on(en, this.setCategoryDelegate);
        });
    }
    
    deattachEvents (viewModel: CategoryEntryViewModel) {
        _.each('change:CategoryName change:Description'.split(' '), (en) => {
            $(this.props.viewModel).off(en, this.setCategoryDelegate);
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
        
        this.state.category.saveCategory();
    }

    render () {
        
        return template.call(this, this.props.viewModel);
    }
}

export = CategoryItemView;