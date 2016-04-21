/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/jira_view_model.ts" />
/// <reference path="../view_models/issue_entry_view_model.ts" />
/// <reference path="issue_view.ts" />
/// <reference path="epics_view.ts" />
/// <reference path="filter_view.ts" />
import $ = require('jquery');
import _ = require('underscore');
import BaseView = require('app/jira/base/base_view');
import FilterView = require('app/jira/views/filter_view');
import EpicsView = require('app/jira/views/epics_view');
import IssueView = require('app/jira/views/issue_view');
import Utils = require('app/jira/utils');
import template = require('hgn!app/jira/templates/jira_template');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model');

class JiraView extends BaseView<JiraViewModel> {
    views : IssueView[] = []
    
    commands () {
        return {
            'click.command .filter-reset': 'ResetFiltersCommand'
        };
    }
    
    init (opts: any) {
        this.$el = opts.el ? $(opts.el) : $('<div/>');
        super.init(opts);
        
        this.views = [];
        
        $(this.viewModel).on('change:issues', _.bind(this.drawItems, this));
    }
    drawItem (viewModel: IssueEntryViewModel) {
        var view = new IssueView({
            viewModel: viewModel
        }).appendTo($('.issues-list')).draw();
        
        this.views.push(view);
    }
    drawItems () {
        var issues = this.viewModel.getIssues();
        this.views = [];
        _.each(issues, this.drawItem, this);
    }
    draw () {
        var data = {
                domain: 'https://dev.local'
            },
            html = template(data);
            
        this.$el.html(html);
        
        this.drawItems();
        
        return this;
    }
}
export = JiraView;