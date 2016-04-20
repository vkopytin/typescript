/// <reference path="../../../vendor.d.ts" />
/// <reference path="page_view_model.ts" />
/// <reference path="issue_entry_view_model.ts" />
/// <reference path="../models/model.ts" />
import $ = require('jquery');
import _ = require('underscore');
//import BaseViewModel = require('app/jira/base/base_view_model');
import BaseViewModel = require('app/jira/view_models/page_view_model');
import IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model');
import Model = require('app/jira/models/model');
    
class EmailViewModel extends BaseViewModel {
    changeIssuesDelegate: any
    
    issues: any

    getIssues () {
        return this.issues;
    }
    setIssues (value) {
        var issues = this.issues;
        _.defer(function () {
            _.each(issues, function (viewModel) {
                viewModel.finish();
            });
        }, 0);
        this.issues = value;
        this.triggerProperyChanged('change:issues');
    }
    init (opts) {
        var model = Model.getCurrent();
        super.init(opts);
        
        this.changeIssuesDelegate = _.bind(this.changeIssues, this);
        $(model).on('model.issues', this.changeIssuesDelegate);
        
        _.defer(_.bind(function () {
            this.fetchIssues();
        }, this), 0);
    }
    finish () {
        var model = Model.getCurrent();
        $(model).off('model.issues', this.changeIssuesDelegate);
        this.setIssues([]);
        super.finish();
    }
    changeIssues () {
        var model = Model.getCurrent(),
            issues = model.getIssues();
            
        this.setIssues(_.map(issues, function (item) {
            return new IssueEntryViewModel(item);
        }));
    }
    fetchIssues () {
        var model = Model.getCurrent();
        model.resetFilter({
            status: '10009'
        });
    }
}
export = EmailViewModel;