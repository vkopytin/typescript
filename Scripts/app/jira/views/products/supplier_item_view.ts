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
    setSupplierDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            supplier: this.props.viewModel
        };
        
        this.setSupplierDelegate = _.bind(this.setSupplier, this);
    }
    
    setSupplier () {
        this.setState({
            supplier: this.props.viewModel
        });
    }
    
    attachEvents (viewModel: SupplierEntryViewModel): void {
        _.each('change:CompanyName change:Address'.split(' '), (en) => {
            $(viewModel).on(en, this.setSupplierDelegate);
        });
    }
    
    deattachEvents (viewModel: SupplierEntryViewModel): void {
        _.each('change:CompanyName change:Address'.split(' '), (en) => {
            $(viewModel).off(en, this.setSupplierDelegate);
        });
    }

    componentWillMount () {
        this.attachEvents(this.props.viewModel);
    }
    
    componentWillUnmount () {
        this.deattachEvents(this.props.viewModel);
    }
    
    componentWillReceiveProps (props: ISupplierItemView) {
        this.deattachEvents(this.props.viewModel);
        this.attachEvents(props.viewModel);
    }
    
    onClick (evnt: any): any {
        evnt.preventDefault();
        this.props.onSelect && this.props.onSelect();
    }
    
    updateCompanyName (evnt: any) {
        evnt.preventDefault();
        var val = $(evnt.target).val();
        
        this.setState({
            supplier: this.state.supplier.setCompanyName(val)
        });
    }
    
    updateAddress (evnt: any) {
        evnt.preventDefault();
        var val = $(evnt.target).val();
        
        this.setState({
            supplier: this.state.supplier.setAddress(val)
        });
    }
    
    saveSupplier (evnt: any) {
        evnt.preventDefault();
        
        this.state.supplier.saveSupplier();
    }
    
    render () {
        
        return template.call(this, this.state.supplier);
    }
}

export = SupplierItemView;