/// <reference path="../command.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../base/base_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseViewModel = require('app/jira/base/base_view_model');
import Command = require('app/jira/command');
import Model = require('app/jira/models/model');

interface IFilterEntryViewModel extends BaseViewModel {
	getSelected ();
}

class FilterEpicViewModel extends BaseViewModel implements IFilterEntryViewModel {
    resetItemDelegate: any
    
    SelectCommand: Command
    
    getId () : string {
        return this.opts.id;
    }
    getSelected () {
        return this.opts.selected;
    }
    setSelected (value) {
        var model = Model.getCurrent();
        this.opts.selected = value;
        
        this.triggerProperyChanged('change:selected');
        
        model.toggleFilter('epicLink', this.getId(), value);
    }
    init (opts) {
        var model = Model.getCurrent();
        super.init(opts);
        
        this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
        
        _.each({
            'model.filterReset': this.resetItemDelegate = _.bind(this.resetItem, this)
        }, function (h, e) { $(model).on(e, h); });
    }
    finish () {
        var model = Model.getCurrent();
        _.each({
            'model.filterReset': this.resetItemDelegate
        }, (h, e) => { $(model).off(e, h); });
        
        super.finish();
    }
    onChangeSelected () {
        this.setSelected(!this.getSelected());
    }
    resetItem () {
        this.getSelected() && this.setSelected(false);
    }
}
export = FilterEpicViewModel;