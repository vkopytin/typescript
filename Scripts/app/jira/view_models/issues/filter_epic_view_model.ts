/// <reference path="../../command.ts" />
/// <reference path="../../models/model.ts" />
/// <reference path="../../base/base_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseViewModel = require('app/jira/base/base_view_model');
import Command = require('app/jira/command');
import Model = require('app/jira/models/model');

interface IFilterEntryViewModel extends BaseViewModel {
	getSelected(): boolean;
}

class FilterEpicViewModel extends BaseViewModel implements IFilterEntryViewModel {
    resetItemDelegate: any
    
    SelectCommand: Command
    
    getId () : string {
        return this.opts.id;
    }
    getSelected (): boolean {
        return this.opts.selected;
    }
    setSelected (value: boolean): void {
        var model = Model.getCurrent();
        this.opts.selected = value;
        
        this.triggerProperyChanged('change:selected');
        this.onPropertyChange('Selected', value);
        
        model.toggleFilter('epicLink', this.getId(), value);
    }
    init (opts: any): void {
        var model = Model.getCurrent();
        super.init(opts);
        
        this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
        
        _.each({
            'model.filterReset': this.resetItemDelegate = _.bind(this.resetItem, this)
        }, function (h, e) { $(model).on(e, h); });
    }
    finish (): void {
        var model = Model.getCurrent();
        _.each({
            'model.filterReset': this.resetItemDelegate
        }, (h, e) => { $(model).off(e, h); });
        
        super.finish();
    }
    getCommand (name: string): Command {
        switch (name) {
            case 'SelectCommand':
                return this.SelectCommand;
            default:
                return super.getCommand(name);
        }
    }
    onChangeSelected (): void {
        this.setSelected(!this.getSelected());
    }
    resetItem (): void {
        this.getSelected() && this.setSelected(false);
    }
}
export = FilterEpicViewModel;