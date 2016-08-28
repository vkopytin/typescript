/// <reference path="../../base/base_view_model.ts" />
import _ = require('underscore');
import BaseViewModel = require('app/jira/base/base_view_model');
import Model = require('app/jira/models/accounting_model');

 
class CategoryEntryViewModel extends BaseViewModel {

    getId () {
        return this.opts.Id;
    }

    init (opts: any): any {
        this.defaults = {
            Id: -1,
            CategoryName: '',
            Description: ''
        };
        super.init(opts);
    }
    
    setData (data: any): any {
        _.each(data, (value, key) => {
           var setter = this['set' + key];
           
           setter && setter.call(this, value); 
        });
    }
    
    saveCategory () {
        var model = Model.getCurent();
        model.saveCategory(this.toJSON());
    }
}
export = CategoryEntryViewModel;