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
    viewModel: JiraViewModel;
    el: any;
}

interface IJiraView extends React.Props<any> {
    viewModel: JiraViewModel;
}

class JiraView extends BaseView<JiraViewModel, IJiraView> {

    commands (): { [key: string]: string } {
        return {
            'click.command .filter-reset': 'ResetFiltersCommand'
        };
    }
    
    init (opts: IJiraViewOptions): void {
        super.init(opts);
        
        this.state = {
            issues: this.viewModel.getIssues()
        };
        
        $(this.viewModel).on('change:issues', _.bind(this.setIssues, this));
        
    }
    
    setIssues () {
        this.setState({
            issues: this.viewModel.getIssues()
        })
    }
    
    render () {
        return template.call(this, IssueView);
    }
}
export = JiraView;