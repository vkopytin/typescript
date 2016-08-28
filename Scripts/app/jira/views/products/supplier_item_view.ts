import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import SupplierEntryViewModel = require('app/jira/view_models/products/supplier_entry_view_model');
import template = require('app/jira/templates/products/supplier_item_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface ISupplierItemView {
    viewModel: SupplierEntryViewModel
    onSelect?: Function
}

class SupplierItemView extends BaseView<SupplierEntryViewModel, ISupplierItemView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            supplier: this.props.viewModel
        };
    }
    
    setProduct () {
        this.setState({
            supplier: this.props.viewModel
        });
    }
    
    componentWillMount () {
        _.each('change:CompanyName change:Address'.split(' '), (en) => {
            $(this.props.viewModel).on(en, _.bind(this.setProduct, this));
        });
    }
    
    componentWillUnmount () {
        _.each('change:CompanyName change:Address'.split(' '), (en) => {
            $(this.props.viewModel).off(en);
        });
    }
    
    componentWillReceiveProps (props: ISupplierItemView) {
        _.each('change:CompanyName change:Address'.split(' '), (en) => {
            $(this.props.viewModel).off(en);
            $(props.viewModel).on(en, _.bind(this.setProduct, this));
        });
    }
    
    onClick (evnt: any): any {
        evnt.preventDefault();
        this.props.onSelect && this.props.onSelect();
    }
    
    updateCompanyName (evnt: any) {
        evnt.preventDefault();
        var val = $(evnt.target).text();
        
        this.setState({
            supplier: this.state.supplier.setCompanyName(val)
        });
    }
    
    updateAddress (evnt: any) {
        evnt.preventDefault();
        var val = $(evnt.target).text();
        
        this.setState({
            supplier: this.state.supplier.setAddress(val)
        });
    }
    
    saveSupplier (evnt: any) {
        evnt.preventDefault();
        
        this.props.viewModel.saveSupplier();
    }
    
    render () {
        
        return template.call(this, this.props.viewModel);
    }
}

export = SupplierItemView;