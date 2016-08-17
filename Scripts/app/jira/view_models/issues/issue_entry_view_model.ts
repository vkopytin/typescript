/// <reference path="../../base/base_view_model.ts" />
import BaseViewModel = require('app/jira/base/base_view_model');
    
class IssueEntryViewModel extends BaseViewModel {
	
    getId () {
        return this.opts.Key;
    }
}
export = IssueEntryViewModel;