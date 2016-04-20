/// <reference path="../../../vendor.d.ts" />
/// <reference path="../command.ts" />
/// <reference path="../models/model.ts" />
/// <reference path="../base/base_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseViewModel = require('app/jira/base/base_view_model');
import Command = require('app/jira/command');
import Model = require('app/jira/models/model');
    
class FilterEntryViewModel extends BaseViewModel {
    resetItemDelegate: any
    
    opts: any
    
    SelectCommand: Command
    
    getId () {
        return this.opts.id;
    }
    getSelected () {
        return this.opts.selected;
    }
    setSelected (value) {
        var model = Model.getCurrent();
        this.opts.selected = value;
        
        this.triggerProperyChanged('change:selected');
        
        model.toggleFilter('status', this.getId(), value);
    }
    init (opts) {
        var model = Model.getCurrent();
        super.init(opts);
        
        this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
        
        this.resetItemDelegate = _.bind(this.resetItem, this);
        $(model).on('model.filterReset', this.resetItemDelegate);
    }
    finish () {
        var model = Model.getCurrent();
        $(model).off('model.filterReset', this.resetItemDelegate);
        super.finish();
    }
    onChangeSelected () {
        this.setSelected(!this.getSelected());
    }
    resetItem () {
        this.getSelected() && this.setSelected(false);
    }
}
export = FilterEntryViewModel;