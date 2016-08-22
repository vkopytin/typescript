/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/categories_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface ICategoriesView extends React.Props<any> {
    viewModel: FeedingViewModel
}

class CategoriesView extends BaseView<FeedingViewModel, ICategoriesView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            categories: this.props.viewModel.getCategories()
        };
    }
    
    setCategories () {
        this.setState({
            categories: this.props.viewModel.getCategories()
        });
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:categories', _.bind(this.setCategories, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:categories');
    }
    
    componentWillReceiveProps (props: ICategoriesView) {
        $(this.props.viewModel).off('change:categories');
        $(props.viewModel).on('change:categories', _.bind(this.setCategories, this));
    }
    
    render () {
        return template.call(this);
    }
}

export = CategoriesView;