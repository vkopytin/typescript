/// <reference path="../../../vendor.d.ts" />
/// <reference path="base.ts" />
/// <reference path="base_view_model.ts" />
/// <reference path="../command.ts" />

import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');
import BaseViewModel = require('app/jira/base/base_view_model');
import IBaseView = require('app/jira/base/i_base_view');
import Command = require('app/jira/command');
import React = require('react');

class BaseView<TViewModel extends BaseViewModel, TBaseView extends IBaseView> extends React.Component<TBaseView, any> {
    __name: string
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
    
    init (opts: any): void {

        $(this.props.viewModel).on('viewModel.finish', _.bind(this.finish, this));
    }
    
    finish (): void {
        window.report[this.__name] = --window.report[this.__name];
        if (this.isFinish) {
            throw('Warinig: Object is removed two times.');
        }
        this.isFinish = true;
        //console.log('Removed: ' + this.constructor.name);
    }

    runCommand (name: string, options: {[key: string]: any}): void {
        var command = this.props.viewModel.getCommand(name);
        if (command) {
            command.execute.apply(command, arguments);
        }
    }
    
    onNavigateTo (): void {
        this.props.viewModel && this.props.viewModel.navigateTo();
    }
    onNavigateFrom (): void {
        this.props.viewModel && this.props.viewModel.navigateFrom();
    }
}
export = BaseView;