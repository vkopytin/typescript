/// <reference path="../../../vendor.d.ts" />
/// <reference path="base.ts" />
/// <reference path="base_view_model.ts" />
/// <reference path="../command.ts" />

import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');
import BaseViewModel = require('app/jira/base/base_view_model');
import Command = require('app/jira/command');

interface IBaseViewOptions<TViewModel extends BaseViewModel> {
    viewModel: TViewModel;
}

class BaseView<TViewModel extends BaseViewModel> extends Base {
    viewModel: TViewModel
    $el: any
    
    constructor (opts: IBaseViewOptions<TViewModel>) {
        super();
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    }
    commands (): { [key: string]: string } {
        // declare commands from the child view
        return {};
    }
    bindings (): { [key: string]: Function } {
        // declare binding rules from the child view
        return {};
    }
    
    init (opts: IBaseViewOptions<TViewModel>): void {
        
        this.viewModel = opts.viewModel;
        var bindings = _.extend({},
            _.result(this, 'bindings'),
            _.result(opts, 'bindings') || {}
        );
        
        $(this.viewModel).on('viewModel.finish', _.bind(this.finish, this));
        
        this.initBindings(bindings);
        this.initCommands(_.result(this, 'commands'));
        this.$el.toggleClass('highlight', true);
        this.$el.attr('data-type', this.__name);
    }
    finish (): void {
        this.$el.off();
        this.$el.remove();
        delete this.$el;
        super.finish();
        //console.log('Removed: ' + this.constructor.name);
    }
    initBindings (bindings: {[key: string]: Function}): void {
        _.each(bindings, (value: Function, key: string) => {
            var value = value, key = key;
            $(this.viewModel).on(key, () => {
                value.call(this, this, this.viewModel);
            });
        }, this);
    }
    initCommands (commands: {[key: string]: string}): void {
        _.each(commands, (value, key) => {
            var pair: string[] = key.split(/\s+/);
            $(this.$el).on(pair[0], pair[1], (evnt) => {
                var command = this.viewModel.getCommand(value);
                
                command.execute();
            });
        }, this);
    }
    appendTo (el: any): BaseView<TViewModel> {
        $(el).append(this.$el);
        
        return this;
    }
    onNavigateTo (): void {
        this.viewModel && this.viewModel.navigateTo();
    }
    onNavigateFrom (): void {
        this.viewModel && this.viewModel.navigateFrom();
    }
    draw () : any {
        return this;
    }
}
export = BaseView;