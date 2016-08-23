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

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            orders: this.props.viewModel.getOrders()
        };
    }
    
    setOrders () {
        this.setState({
            orders: this.props.viewModel.getOrders()
        });
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:orders', _.bind(this.setOrders, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:orders');
    }
    
    componentWillReceiveProps (props: IOrdersView) {
        $(this.props.viewModel).off('change:orders');
        $(props.viewModel).on('change:orders', _.bind(this.setOrders, this));
    }
    
    render () {
        return template.call(this);
    }
}

export = OrdersView;