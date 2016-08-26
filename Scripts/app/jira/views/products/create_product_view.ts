/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/create_product_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface ICreateProductView extends React.Props<any> {
    viewModel: FeedingViewModel
}

class CreateProductView extends BaseView<FeedingViewModel, ICreateProductView> {
    setProductDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            product: this.props.viewModel.getCurentProduct()
        };
        
        this.setProductDelegate = _.bind(this.setProduct, this);
    }
    
    setProduct () {
        this.setState({
            product: this.props.viewModel.getCurentProduct()
        });
    }
    
    attachEvents (viewModel: any): void {
        $(viewModel).on('change:CurentProduct', this.setProductDelegate);
    }
    
    deatachEvents (viewModel: any): void {
        $(viewModel).off('change:CurentProduct', this.setProductDelegate);
    }
    
    componentWillMount () {
        this.attachEvents(this.props.viewModel);
    }
    
    componentWillUnmount () {
        this.deatachEvents(this.props.viewModel);
    }
    
    componentWillReceiveProps (props: ICreateProductView) {
        this.deatachEvents(this.props.viewModel);
        this.attachEvents(props.viewModel);
    }
    
    updateProductName (evnt: any) {
        evnt.preventDefault();
        this.setState({
            product: this.state.product.setProductName(evnt.target.value)
        });
    }
    
    updateUnitPrice (evnt: any) {
        evnt.preventDefault();
        this.setState({
            product: this.state.product.setUnitPrice(evnt.target.value)
        });
    }
    
    updateQuantityPerUnit (evnt: any) {
        evnt.preventDefault();
        this.setState({
            product: this.state.product.setQuantityPerUnit(evnt.target.value)
        })
    }
    
    updateUnitsOnOrder (evnt: any) {
        evnt.preventDefault();
        this.setState({
            product: this.state.product.setUnitsOnOrder(evnt.target.value)
        })
    }
    
    saveProduct (evnt: any) {
        evnt.preventDefault();
        this.props.viewModel.saveCurentProduct();
    }
    
    onSubmsubmitFormit (evnt: any) {
        evnt.preventDefault();
    }
    
    render () {
        return template.call(this);
    }
}

export = CreateProductView;