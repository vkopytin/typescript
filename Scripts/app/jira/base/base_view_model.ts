/// <reference path="base.ts" />
/// <reference path="../command.ts" />

import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');
import Command = require('app/jira/command');


class ViewModelBase extends Base {
    [key: string]: any
    
    opts: any
    navigation: ViewModelBase
    defaults: {[key: string]: any}
    
    constructor (opts: any) {
        super();
        this.init(opts);
        
        _.each(this.opts, (val: any, key: string) => {
            this.opts[key] = val;
            this['set' + key] = (value: any) => {
                if (value === this.opts[key]) {
                    return this;
                }
                
                this.opts[key] = value;
                
                this.triggerProperyChanged('change:' + key, value);
                this.onPropertyChange(key, value);
                
                return this;
            };
            this['get' + key] = () => {
                return this.opts[key];
            };
        });
        //console.log('Created: ' + this.constructor.name)
    }

    init (opts: any): void {
        this.opts = _.extend({}, this.defaults, opts);
    }
    
    finish (): void {
        this.triggerProperyChanged('viewModel.finish');
        $(this).off();
        super.finish();
        //console.log('Removed: ' + this.constructor.name);
    }
    
    getCommand (name: string): Command {
        throw "Command [" + name + "] is not defined";
    }
    
    triggerProperyChanged (propertyName: string, opts?: any): void {
        //console.log('ViewModel.trigger: ' + propertyName);
        $(this).trigger(propertyName);
    }
    
    onPropertyChange (propertyName: string, value: any): void {
        $(this).trigger('change', { name: propertyName, value: value });
    }
    
    navigateTo (): void {
        
    }
    
    navigateFrom (): void {
        this.finish();
    }
    
    toJSON (): any {
        return this.opts;
    }
}
export = ViewModelBase;