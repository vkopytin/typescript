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
    setCartsDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            cart: this.props.viewModel.getCart()
        };
        
        this.setCartsDelegate = _.bind(this.setCart, this);
    }
    
    setCart () {
        this.setState({
            cart: this.props.viewModel.getCart()
        });
    }
    
    attachEvents (viewModel: FeedingViewModel): void {
        $(viewModel).on('change:carts', this.setCartsDelegate);
    }
    
    deattachEvents (viewModel: FeedingViewModel): void {
        $(viewModel).off('change:carts', this.setCartsDelegate);
    }
    
    componentWillMount () {
        this.attachEvents(this.props.viewModel);
    }
    
    componentWillUnmount () {
        this.deattachEvents(this.props.viewModel);
    }
    
    componentWillReceiveProps (props: ICartView) {
        this.deattachEvents(this.props.viewModel);
        this.attachEvents(props.viewModel);
    }
    
    render () {
        return template.call(this);
    }
}

export = CartView;