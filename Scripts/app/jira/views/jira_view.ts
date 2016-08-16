/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/jira_view_model.ts" />
/// <reference path="../view_models/issue_entry_view_model.ts" />
/// <reference path="issue_view.ts" />

import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import FilterView = require('app/jira/views/filter_view');
import EpicsView = require('app/jira/views/epics_view');
import IssueView = require('app/jira/views/issue_view');
import Utils = require('app/jira/utils');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model');
import template = require('app/jira/templates/jira_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IJiraViewOptions {
    viewModel: JiraViewModel
}

interface IJiraView extends React.Props<any> {
    viewModel: JiraViewModel
    issues: (vm: JiraViewModel) => IssueEntryViewModel[]
}

class JiraView extends BaseView<JiraViewModel, IJiraView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            issues: this.props.issues(this.props.viewModel)
        };
    }
    
    setIssues () {
        this.setState({
            issues: this.props.issues(this.props.viewModel)
        })
    }
    
    init (opts: IJiraViewOptions): void {
        super.init(opts);
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:issues', _.bind(this.setIssues, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:issues');
    }
    
    componentWillReceiveProps (props: IJiraView) {
        $(this.props.viewModel).off('change:issues');
        $(props.viewModel).on('change:issues', _.bind(this.setIssues, this));
    }
    
    render () {
        return template.call(this, IssueView);
    }
}
export = JiraView;