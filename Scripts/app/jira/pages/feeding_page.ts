/// <reference path="../base/base.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../view_models/products/feeding_view_model.ts" />

import _ = require('underscore');
import $ = require('jquery');
import IBaseView = require('app/jira/base/i_base_view');
import BaseView = require('app/jira/base/base_view');
import Base = require('app/jira/base/base');
import Utils = require('app/jira/utils');
import template = require('app/jira/pages/feeding_page_template');
import master_page_template = require('app/jira/templates/master_page_template');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import React = require('react');
import ReactDOM = require('react-dom');

interface IFeedingPage extends IBaseView {
    viewModel: FeedingViewModel
    productsTotal: number
}

class FeedingPage extends BaseView<FeedingViewModel, IFeedingPage> {
    setProductsTotalDelegate: any
    updateCartDelegate: any

    handlers = {
        onDraw: function () {
            _.defer(function () {
                $('#main-menu').metisMenu();
            });
        }
    }
    
    setProductsTotal (value: number): void {
        this.setState(_.extend(this.state, {
            productsTotal: this.props.viewModel.getProductsTotal()
        }));
    }
    
    updateCart (): void {
        var cart = this.props.viewModel.getCart();
        cart && this.setState(_.extend(this.state, {
            cartDate: new Date(cart.getCartDate()).toLocaleString(),
            cartName: cart.getId()
        }));
    }
    
    constructor(opts: any) {
        super(opts);
        
        var cart = this.props.viewModel.getCart();

        this.state = {
            cartDate: cart && new Date(cart.getCartDate()).toLocaleString(),
            cartName: cart && cart.getId(),
            productsTotal: this.props.viewModel.getProductsTotal()
        };
        
        this.searchProductsInternal = _.debounce(this.searchProductsInternal, 500);
        this.setProductsTotalDelegate = _.bind(this.setProductsTotal, this);
        this.updateCartDelegate = _.bind(this.updateCart, this);
    }
    
    init (options: any): void {
        _.extend(this.handlers, options.handlers || {});
        
        super.init(options);
    }
    
    finish (): void {
        Base.prototype.finish.apply(this, arguments);
    }
    
    attachEvents (viewModel: any) {
        $(viewModel).on('change:products', this.setProductsTotalDelegate);
        $(viewModel).on('change:carts', this.updateCartDelegate);
    }
    
    deattachEvents (viewModel: any) {
        $(viewModel).off('change:products', this.setProductsTotalDelegate);
        $(viewModel).off('change:carts', this.updateCartDelegate);
    }

    componentWillMount () {
        this.attachEvents(this.props.viewModel);
    }
    
    componentWillUnmount () {
        this.deattachEvents(this.props.viewModel);
    }
    
    componentWillReceiveProps (props: IFeedingPage) {
        this.deattachEvents(this.props.viewModel);
        this.attachEvents(props.viewModel);
    }
    
    onNavigateTo (): any {
        this.handlers.onDraw.call(this);
        return super.onNavigateTo();
    }
    
    render () {        
        return master_page_template.call(this,
                template.call(this, this.props.viewModel)
            );
    }
    
    fetchProducts (evnt: any, from: number, count: number): void {
        evnt.preventDefault();
        this.props.viewModel.fetchProducts(from, count);
    }
    
    searchProducts (evnt: any): void {
        var subject = $(evnt.target).val();
        evnt.preventDefault();
        
        this.searchProductsInternal(subject);
    }
    
    searchProductsInternal (subject: any): void {
        this.props.viewModel.searchProducts(subject);
    }
    
    createCart (evnt: any): void {
        this.props.viewModel.createCart();
    }
}
export = FeedingPage;