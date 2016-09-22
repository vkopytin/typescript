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
    setSuppliersDelegate = () => this.setSuppliers()
    
    setSuppliers () {
        this.setState({
            suppliers: this.props.viewModel.getSuppliers()
        });
    }

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            suppliers: this.props.viewModel.getSuppliers()
        };
    }

    attachEvents (viewModel: FeedingViewModel): void {
        super.attachEvents(viewModel);
        _.each('change:suppliers'.split(' '), (en) => {
            $(viewModel).on(en, this.setSuppliersDelegate);
        });
    }
    
    detachEvents (viewModel: FeedingViewModel): void {
        super.detachEvents(viewModel);
        _.each('change:suppliers'.split(' '), (en) => {
            $(viewModel).off(en, this.setSuppliersDelegate);
        });
    }

    render () {
        return template.call(this);
    }
}

export = SuppliersView;