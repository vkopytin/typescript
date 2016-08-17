/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
/// <reference path="../../view_models/issues/jira_view_model.ts" />
/// <reference path="../../view_models/issues/issue_entry_view_model.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/products_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IProductsViewOptions {
    viewModel: FeedingViewModel
}

interface IProductsView extends React.Props<any> {
    viewModel: FeedingViewModel
    products: (vm: FeedingViewModel) => any[]
}

class ProductsView extends BaseView<FeedingViewModel, IProductsView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            products: this.props.products(this.props.viewModel)
        };
    }
    
    setProducts () {
        this.setState({
            products: this.props.products(this.props.viewModel)
        })
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:products', _.bind(this.setProducts, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:products');
    }
    
    componentWillReceiveProps (props: IProductsView) {
        $(this.props.viewModel).off('change:products');
        $(props.viewModel).on('change:products', _.bind(this.setProducts, this));
    }
    
    render () {
        return template.call(this);
    }
}

export = ProductsView;