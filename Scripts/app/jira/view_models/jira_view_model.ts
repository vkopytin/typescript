/// <reference path="../../../vendor.d.ts" />
/// <reference path="../command.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../utils.ts" />
/// <reference path="page_view_model.ts" />
/// <reference path="filter_entry_view_model.ts" />
/// <reference path="filter_epic_view_model.ts" />
/// <reference path="issue_entry_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
    //import BaseViewModel = require('app/jira/base/base_view_model');
import BaseViewModel = require('app/jira/view_models/page_view_model');
import FilterEntryViewModel = require('app/jira/view_models/filter_entry_view_model');
import FilterEpicViewModel = require('app/jira/view_models/filter_epic_view_model');
import IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model');
import Command = require('app/jira/command');
import Model = require('app/jira/models/model');
import Utils = require('app/jira/utils');
    
var filters = [{
        id: 'Deploy',
        selected: false,
        name: 'Ready to Deploy'
    }, {
        id: '"Code Review"',
        selected: false,
        name: 'Code Review'
    }, {
        id: 'Backlog',
        selected: false,
        name: 'Backlog'
    }, {
        id: '"Selected for Development"',
        selected: false,
        name: 'Selected for Development'
    }, {
        id: 'Done',
        selected: false,
        name: 'Done'
    }];
        
class JiraViewModel extends BaseViewModel {
    changeIssuesDelegate: any
    changeStatusesDelegate: any
    changeEpicsDelegate: any
    
    issues: any
    filterItems: any
    epics: any
    currentFiler: any
    
    ResetFiltersCommand: Command
    
    getIssues () {
        return this.issues;
    }
    setIssues (value) {
        var issues = this.issues;
        _.defer(() => {
            _.each(issues, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.issues = value;
        this.triggerProperyChanged('change:issues');
    }
    getFilterItems () {
        return this.filterItems;
    }
    setStatuses (value) {
        var filterItems = this.filterItems;
        _.defer(() => {
            _.each(filterItems, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.filterItems = value;
        this.triggerProperyChanged('change:statuses');
    }
    getEpics () {
        return this.epics;
    }
    setEpics (value) {
        var epics = this.epics;
        _.defer(() => {
            _.each(epics, (viewModel) => {
                viewModel.finish();
            });
        }, 0);
        this.epics = value;
        this.triggerProperyChanged('change:epics');
    }
    getFilter () {
        var filterItems = _.reduce(this.filterItems, (res, item) => {
            if (item.getSelected()) {
                res.push(item.getId());
            }
            
            return res;
        }, []);
        
        return {
            status: filterItems.join(',')
        };
    }
    init (opts) {
        var model = Model.getCurrent();
        super.init(opts);
        this.currentFiler = {};
        this.filterItems = _.map(filters, (item) => {
            return new FilterEntryViewModel(item);
        });
        
        this.ResetFiltersCommand = new Command({ execute: this.onResetFilters, scope: this });

        _.each({
            'model.issues': this.changeIssuesDelegate = _.bind(this.changeIssues, this),
            'model.statuses': this.changeStatusesDelegate = _.bind(this.changeStatuses, this),
            'model.epics': this.changeEpicsDelegate = _.bind(this.changeEpics, this)
        }, (h, e) => { $(model).on(e, h); });
        
        _.defer(_.bind(() => {
            this.fetchStatuses();
            this.fetchIssues();
            this.fetchEpics();
        }, this), 0);
    }
    finish () {
        var model = Model.getCurrent();
        _.each({
            'model.issues': this.changeIssuesDelegate,
            'model.statuses': this.changeStatusesDelegate,
            'model.epics': this.changeEpicsDelegate
        }, (h, e) => { $(model).off(e, h); });
        this.setIssues([]);
        this.setEpics([]);
        this.setStatuses([]);
        
        super.finish();
    }
    onResetFilters () {
        var model = Model.getCurrent();
        model.resetFilter();
    }
    changeIssues () {
        var model = Model.getCurrent(),
            issues = model.getIssues();
            
        this.setIssues(_.map(issues, (item) => {
            return new IssueEntryViewModel(item);
        }, this));
    }
    changeStatuses () {
        var model = Model.getCurrent(),
            statuses = model.getStatuses();
            
        this.setStatuses(_.map(statuses, (item) => new FilterEntryViewModel(item), this));
    }
    changeEpics () {
        var model = Model.getCurrent(),
            epics = model.getEpics();
            
        this.setEpics(_.map(epics, (item) => new FilterEpicViewModel({
                id: item.Key,
                selected: false,
                name: item.fields.summary
            })
        , this));
    }
    fetchIssues () {
        var model = Model.getCurrent();
        model.resetFilter();
    }
    fetchStatuses () {
        var model = Model.getCurrent();
        model.fetchStatuses();
    }
    fetchEpics () {
        var model = Model.getCurrent();
        model.fetchEpics();
    }
}
export = JiraViewModel;