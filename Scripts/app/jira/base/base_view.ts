/// <reference path="../../../vendor.d.ts" />
/// <reference path="base.ts" />
/// <reference path="base_view_model.ts" />
/// <reference path="../command.ts" />

import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');
import BaseViewModel = require('app/jira/base/base_view_model');
import Command = require('app/jira/command');
import React = require('react');

class BaseView<TViewModel extends BaseViewModel, TBaseView extends React.Props<any>> extends React.Component<TBaseView, any> {
    __name: string
    viewModel: TViewModel
    $el: any
    [key: string]: any
    
    isFinish: boolean = false
    
    constructor (opts: any) {
        super(opts);
        this.__name = this.constructor.name;
    	window.report[this.__name] = ++window.report[this.__name] || 1;

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
    
    init (opts: any): void {
        
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
        window.report[this.__name] = --window.report[this.__name];
        if (this.isFinish) {
            throw('Warinig: Object is removed two times.');
        }
        this.isFinish = true;
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
    appendTo (el: any): BaseView<TViewModel, TBaseView> {
        $(el).append(this.$el);
        
        return this;
    }
    onNavigateTo (): void {
        this.viewModel && this.viewModel.navigateTo();
    }
    onNavigateFrom (): void {
        this.viewModel && this.viewModel.navigateFrom();
    }
    render (): any {
        return null;
    }
}
export = BaseView;