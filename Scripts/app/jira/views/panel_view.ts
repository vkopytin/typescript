/// <reference path="../base/base_view.ts" />

import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('app/jira/templates/panel_template');
import BaseViewModel = require('app/jira/base/base_view_model');
import IBaseView = require('app/jira/base/i_base_view');
import React = require('react');

interface IPanelView extends React.Props<any> {
    viewModel: BaseViewModel
    title: string
}

class PanelView extends BaseView<BaseViewModel, IPanelView> {
    opts: any
    
    constructor(opts: any) {
        super(opts);
        this.opts = opts;
    }
    
    render () {
        return template.call(this);
    }
}
export = PanelView;