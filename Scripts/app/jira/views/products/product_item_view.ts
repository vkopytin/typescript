/// <reference path="../../base/base_view.ts" />
/// <reference path="../../view_models/issues/issue_entry_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import ProductEntryViewModel = require('app/jira/view_models/products/product_entry_view_model');
import template = require('app/jira/templates/products/product_item_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IProductItemView {
    viewModel: ProductEntryViewModel
}

class ProductItemView extends BaseView<ProductEntryViewModel, IProductItemView> {

    constructor(opts: any) {
        super(opts);
    }
    
    render () {
        var data = this.props.viewModel.toJSON();
        
        return template.call(this, data);
    }
}

export = ProductItemView;