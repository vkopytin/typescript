/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../page_view_model.ts" />
/// <reference path="../issues/issue_entry_view_model.ts" />
/// <reference path="../../models/model.ts" />
import $ = require('jquery');
import _ = require('underscore');
//import BaseViewModel = require('app/jira/base/base_view_model');
import BaseViewModel = require('app/jira/view_models/page_view_model');
import IssueEntryViewModel = require('app/jira/view_models/issues/issue_entry_view_model');
import Model = require('app/jira/models/model');

class EmailViewModel extends BaseViewModel {
    changeIssuesDelegate: any
    
    issues: IssueEntryViewModel[]

    getIssues (): IssueEntryViewModel[] {
        return this.issues;
    }
    setIssues (value: IssueEntryViewModel[]) {
        var issues = this.issues;
        _.defer(() => 
            _.each(issues, (viewModel) =>
                viewModel.finish()
            )
        , 0);
        this.issues = value;
        this.triggerProperyChanged('change:issues');
        this.onPropertyChange('Issues', value);
    }
    init (opts: any): void {
        var model = Model.getCurrent();
        super.init(opts);
        
        this.changeIssuesDelegate = _.bind(this.changeIssues, this);
        $(model).on('model.issues', this.changeIssuesDelegate);
        
        _.defer(_.bind(function () {
            this.fetchIssues();
        }, this), 0);
    }
    finish (): void {
        var model = Model.getCurrent();
        
        $(model).off('model.issues', this.changeIssuesDelegate);
        
        $(this).off();
        
        this.setIssues([]);
        super.finish();
    }
    changeIssues (): void {
        var model = Model.getCurrent(),
            issues = model.getIssues();
            
        this.setIssues(_.map(issues, (item) => 
            new IssueEntryViewModel(item)
        ));
    }
    fetchIssues (): void {
        var model = Model.getCurrent();
        model.resetFilter({
            status: '10009'
        });
    }
}
export = EmailViewModel;