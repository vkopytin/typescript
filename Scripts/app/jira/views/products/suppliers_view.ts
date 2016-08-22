/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/suppliers_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface ISuppliersView extends React.Props<any> {
    viewModel: FeedingViewModel
}

class SuppliersView extends BaseView<FeedingViewModel, ISuppliersView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            suppliers: this.props.viewModel.getSuppliers()
        };
    }
    
    setSuppliers () {
        this.setState({
            suppliers: this.props.viewModel.getSuppliers()
        });
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:suppliers', _.bind(this.setSuppliers, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:suppliers');
    }
    
    componentWillReceiveProps (props: ISuppliersView) {
        $(this.props.viewModel).off('change:suppliers');
        $(props.viewModel).on('change:suppliers', _.bind(this.setSuppliers, this));
    }
    
    render () {
        return template.call(this);
    }
}

export = SuppliersView;