/// <reference path="../../base/base_view_model.ts" />
import _ = require('underscore');
import BaseViewModel = require('app/jira/base/base_view_model');
import Model = require('app/jira/models/accounting_model');


class SupplierEntryView extends BaseViewModel {

    getId () {
        return this.opts.Id;
    }

    init (opts: any): any {
        this.defaults = {
            Id: -1,
            CompanyName: '',
            Address: ''
        };
        super.init(opts);
    }
    
    setData (data: any): any {
        _.each(data, (value, key) => {
           var setter = this['set' + key];
           
           setter && setter.call(this, value); 
        });
    }
    
    saveSupplier () {
        var model = Model.getCurent();
        model.saveSupplier(this.toJSON());
    }
}
export = SupplierEntryView;