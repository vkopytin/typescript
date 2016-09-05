/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/suppliers_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface ISuppliersView extends React.Props<any> {
    viewModel: FeedingViewModel
}

class SuppliersView extends BaseView<FeedingViewModel, ISuppliersView> {
    setSuppliersDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            suppliers: this.props.viewModel.getSuppliers()
        };
        
        this.setSuppliersDelegate = _.bind(this.setSuppliers, this);
    }
    
    setSuppliers () {
        this.setState({
            suppliers: this.props.viewModel.getSuppliers()
        });
    }

    attachEvents (viewModel: FeedingViewModel): void {
        _.each('change:suppliers'.split(' '), (en) => {
            $(viewModel).on(en, this.setSuppliersDelegate);
        });
    }
    
    deattachEvents (viewModel: FeedingViewModel): void {
        _.each('change:suppliers'.split(' '), (en) => {
            $(viewModel).off(en, this.setSuppliersDelegate);
        });
    }
    
    componentWillMount () {
        this.attachEvents(this.props.viewModel);
    }
    
    componentWillUnmount () {
        this.deattachEvents(this.props.viewModel);
    }
    
    componentWillReceiveProps (props: ISuppliersView) {
        this.deattachEvents(this.props.viewModel);
        this.attachEvents(props.viewModel);
    }

    render () {
        return template.call(this);
    }
}

export = SuppliersView;