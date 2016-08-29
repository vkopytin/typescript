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
    setCategoriesDelegate: any
    setSuppliersDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            product: this.props.viewModel.getCurentProduct(),
            categories: this.props.viewModel.getCategories(),
            suppliers: this.props.viewModel.getSuppliers()
        };
        
        this.setProductDelegate = _.bind(this.setProduct, this);
        this.setCategoriesDelegate = _.bind(this.setProduct, this);
        this.setSuppliersDelegate = _.bind(this.setProduct, this);
    }
    
    setProduct () {
        this.setState(_.extend(this.state, {
            product: this.props.viewModel.getCurentProduct(),
            categories: this.props.viewModel.getCategories(),
            suppliers: this.props.viewModel.getSuppliers()
        }));
    }

    attachEvents (viewModel: any): void {
        $(viewModel).on('change:CurentProduct', this.setProductDelegate);
        $(viewModel).on('change:categories', this.setProductDelegate);
        $(viewModel).on('change:suppliers', this.setProductDelegate);
    }
    
    deatachEvents (viewModel: any): void {
        $(viewModel).off('change:CurentProduct', this.setProductDelegate);
        $(viewModel).off('change:categories', this.setProductDelegate);
        $(viewModel).off('change:suppliers', this.setProductDelegate);
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
    
    updateCategory (evnt: any) {
        evnt.preventDefault();
        var category = _.find(this.state.categories, (item: any) => item.getId() == evnt.target.value);
        if (category) {
            this.setState({
                product: this.state.product.setCategory(category.toJSON())
            });
        }
    }
    
    updateSupplier (evnt: any) {
        evnt.preventDefault();
        var supplier = _.find(this.state.suppliers, (item: any) => item.getId() == evnt.target.value);
        if (supplier) {
            this.setState({
                product: this.state.product.setSupplier(supplier.toJSON())
            });
        }
    }
    
    saveProduct (evnt: any) {
        evnt.preventDefault();
        this.props.viewModel.saveCurentProduct();
    }
    
    newProduct (evnt: any) {
        evnt.preventDefault();
        
        this.props.viewModel.newProduct();
    }
    
    onSubmsubmitFormit (evnt: any) {
        evnt.preventDefault();
    }
    
    render () {
        return template.call(this);
    }
}

export = CreateProductView;