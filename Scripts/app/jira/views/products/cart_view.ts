/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/cart_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface ICartView extends React.Props<any> {
    viewModel: FeedingViewModel
}

class CartView extends BaseView<FeedingViewModel, ICartView> {
    setCartsDelegate = () => this.setCart()
    
    setCart () {
        this.setState({
            cart: this.props.viewModel.getCart()
        });
    }

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            cart: this.props.viewModel.getCart()
        };
    }
    
    attachEvents (viewModel: FeedingViewModel): void {
        super.attachEvents(viewModel);
        $(viewModel).on('change:carts', this.setCartsDelegate);
    }
    
    detachEvents (viewModel: FeedingViewModel): void {
        super.detachEvents(viewModel);
        $(viewModel).off('change:carts', this.setCartsDelegate);
    }
    
    render () {
        return template.call(this);
    }
}

export = CartView;