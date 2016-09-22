/// <reference path="../base/base_view.ts" />

import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('app/jira/ui_controls/tabs_template');
import BaseViewModel = require('app/jira/base/base_view_model');
import IBaseView = require('app/jira/base/i_base_view');
import React = require('react');


interface ITabsView extends React.Props<any> {
    viewModel?: BaseViewModel
    active?: number
}

class TabsView extends BaseView<BaseViewModel, ITabsView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            active: this.props.active || 0
        };
    }
    
    changeTab (evnt: any, active: string): void {
        evnt && evnt.preventDefault();
        this.setState({
            active: active
        });
    }
    
    activeTab (): boolean {
        return this.state.active;
    }
    
    render () {
        return template.call(this);
    }
}
export = TabsView;