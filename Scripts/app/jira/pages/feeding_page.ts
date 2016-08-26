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

    handlers = {
        onDraw: function () {
            $('#main-menu').metisMenu();
        }
    }
    
    setProductsTotal (value: number): void {
        this.setState({
            productsTotal: this.props.viewModel.getProductsTotal()
        });
    }
    
    constructor(opts: any) {
        super(opts);
        
        this.state = {
            productsTotal: this.props.viewModel.getProductsTotal()
        };
        
        this.searchProductsInternal = _.debounce(this.searchProductsInternal, 500);
    }
    
    init (options: any): void {
        _.extend(this.handlers, options.handlers || {});
        
        super.init(options);
    }
    finish (): void {
        Base.prototype.finish.apply(this, arguments);
    }

    componentWillMount () {
        $(this.props.viewModel).on('change:products', _.bind(this.setProductsTotal, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:products');
    }
    
    componentWillReceiveProps (props: IFeedingPage) {
        $(this.props.viewModel).off('change:products');
        $(props.viewModel).on('change:products', _.bind(this.setProductsTotal, this));
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
}
export = FeedingPage;