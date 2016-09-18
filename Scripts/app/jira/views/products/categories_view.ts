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
    setCategoriesDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            categories: this.props.viewModel.getCategories()
        };
        
        this.setCategoriesDelegate = _.bind(this.setCategories, this);
    }
    
    setCategories () {
        this.setState({
            categories: this.props.viewModel.getCategories()
        });
    }
    
    attachEvents (viewModel: any) {
        super.attachEvents(viewModel);
        $(viewModel).on('change:categories', this.setCategoriesDelegate);
    }
    
    detachEvents (viewModel: any) {
        super.detachEvents(viewModel);
        $(viewModel).off('change:categories', this.setCategoriesDelegate);
    }
    
    render () {
        return template.call(this);
    }
}

export = CategoriesView;