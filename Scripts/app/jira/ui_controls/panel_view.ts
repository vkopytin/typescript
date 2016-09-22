/// <reference path="../base/base_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('app/jira/ui_controls/panel_template');
import BaseViewModel = require('app/jira/base/base_view_model');
import IBaseView = require('app/jira/base/i_base_view');
import React = require('react');


interface IPanelView extends React.Props<any> {
    viewModel?: BaseViewModel
    title?: string
    children?: any[]
}

interface IPanelHeaderView extends React.Props<any> {
    children?: any[]
}

class PanelHeaderView extends BaseView<BaseViewModel, IPanelHeaderView> {
    
    render (): any {
        return template.header.call(this);
    }
}

class PanelView extends BaseView<BaseViewModel, IPanelView> {
    opts: any
    
    constructor(opts: any) {
        super(opts);
        this.opts = opts;
    }
    
    getHeader (): any {
        var header = _.find(React.Children.toArray(this.props.children), (el: any) => el.type === PanelHeaderView);
        if (header) {
            return header;
        }
        return template.header.call(this, true);
    }
    
    getChildren (): any {
        return _.reduce(React.Children.toArray(this.props.children), (res: any[], el: any) => {
            if (el.type === PanelHeaderView) {
                return res;
            }
            res.push(el);
            return res;
        }, []);
    }
    
    render () {
        return template.body.call(this);
    }
    
    static Header = PanelHeaderView
}
export = PanelView;