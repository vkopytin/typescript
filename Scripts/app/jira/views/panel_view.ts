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
    
    constructor(opts: any) {
        super(opts);
        this.opts = opts;
    }
    
    init (opts: any): void {
        super.init(opts);
    }
    
    render () {
        return template.call(this);
    }
}
export = PanelView;