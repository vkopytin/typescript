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
import template = require('hgn!app/jira/templates/jira_template');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model');

interface IJiraViewOptions {
    viewModel: JiraViewModel;
    el: any;
}

interface IJiraView {
    
}

class JiraView extends BaseView<JiraViewModel, IJiraView> {
    views : IssueView[] = []
    
    commands (): { [key: string]: string } {
        return {
            'click.command .filter-reset': 'ResetFiltersCommand'
        };
    }
    
    init (opts: IJiraViewOptions): void {
        this.$el = opts.el ? $(opts.el) : $('<div/>');
        super.init(opts);
        
        this.views = [];
        
        $(this.viewModel).on('change:issues', _.bind(this.drawItems, this));
    }
    
    drawItem (viewModel: IssueEntryViewModel): void {
        var view = new IssueView({
            viewModel: viewModel
        }).appendTo($('.issues-list')).draw();
        
        this.views.push(view);
    }
    drawItems (): void {
        var issues = this.viewModel.getIssues();
        this.views = [];
        _.each(issues, this.drawItem, this);
    }
    draw (): any {
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