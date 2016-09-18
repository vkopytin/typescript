/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import Utils = require('app/jira/utils');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');
import template = require('app/jira/templates/products/report_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface IReportView extends React.Props<any> {
    viewModel: FeedingViewModel
}

class ReportView extends BaseView<FeedingViewModel, IReportView> {
    setReportDelegate: any

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            report: this.props.viewModel.getReport()
        };
        
        this.setReportDelegate = _.bind(this.setReport, this);
    }
    
    setReport () {
        this.setState({
            report: this.props.viewModel.getReport()
        });
    }
    
    attachEvents (viewModel: FeedingViewModel) {
        super.attachEvents(viewModel);
        $(viewModel).on('change:report', this.setReportDelegate);
    }
    
    detachEvents (viewModel: FeedingViewModel) {
        super.detachEvents(viewModel);
        $(viewModel).off('change:report', this.setReportDelegate);
    }
    
    render () {
        return template.call(this);
    }
}

export = ReportView;