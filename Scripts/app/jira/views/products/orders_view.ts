/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/orders_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface IOrdersView extends React.Props<any> {
    viewModel: FeedingViewModel
}

class OrdersView extends BaseView<FeedingViewModel, IOrdersView> {
    setOrdersDelegate = () => this.setOrders()
    
    setOrders () {
        this.setState({
            orders: this.props.viewModel.getOrders()
        });
    }

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            orders: this.props.viewModel.getOrders()
        };
    }
    
    attachEvents(viewModel: any) {
        super.attachEvents(viewModel);
        $(viewModel).on('change:orders', this.setOrdersDelegate);
    }
    
    detachEvents(viewModel: any) {
        super.detachEvents(viewModel);
        $(viewModel).off('change:orders', this.setOrdersDelegate);
    }
    
    render () {
        return template.call(this);
    }
}

export = OrdersView;