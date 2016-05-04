/// <reference path="../base/base_view.ts" />

import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('app/jira/templates/panel_template');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import React = require('react');

interface IPanelView extends React.Props<any> {
    viewModel: JiraViewModel
    title: string
}

class PanelView extends BaseView<JiraViewModel, IPanelView> {
    opts: any
    
    init (opts: any): void {
        this.$el = opts.el ? $(opts.el) : $('<div />');
        super.init(opts);
        this.opts = opts;
    }
    
    render () {
        return template.call(this);
    }
    
    draw (): any {
        
        return this;
    }
}
export = PanelView;