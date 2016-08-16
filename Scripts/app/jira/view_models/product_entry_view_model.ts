/// <reference path="../base/base_view_model.ts" />
import BaseViewModel = require('app/jira/base/base_view_model');
    
class ProductEntryViewModel extends BaseViewModel {
	
    getId () {
        return this.opts.id;
    }
}
export = ProductEntryViewModel;