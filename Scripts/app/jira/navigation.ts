/// <reference path="../../vendor.d.ts" />
/// <reference path="base/base.ts" />
import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');
import React = require('react');
import ReactDOM = require('react-dom');

var components: { [key: string]: string[] } = {
        'jira-report': ['app/jira/pages/jira_page', 'app/jira/view_models/issues/jira_view_model'],
        'deploy-email': ['app/jira/pages/email_page', 'app/jira/view_models/email_report/email_view_model'],
        'feeding': ['app/jira/pages/feeding_page', 'app/jira/view_models/products/feeding_view_model']
    },
    inst: Navigation;

class Navigation extends Base {
    view: any

    constructor(opts: any) {
        super();
        
        this.init(opts);
    }
    
    init (opts: any): void {
        
    }

    getView () {
        var match = window.location.href.match(/#(.*)$/);
        return match ? match[1] : '';
    }
    setHash (hashPath: string) {
        window.location.hash = '#' + hashPath;
    }
    loadComponent (componentName: string) {
        var deps = components[componentName];
            
        this.view && _.defer(() => this.view.onNavigateFrom(), 0);
        this.setHash(componentName);
        
        if (deps) {
            require(deps, (View: any, ViewModel: any) => {
                var $root = $('<div/>');
                $(document.body).empty().append($root);
                var view = React.createElement(View, {
                    el: $root,
                    viewModel: new ViewModel()
                });
                this.view = ReactDOM.render(view, $root.get(0), function () {
                    _.defer(() => this.onNavigateTo(), 0);
                });
            });
        }
    }
    static getInstance () : Navigation {
        if (inst) {
            return inst;
        }
    
        return inst = new Navigation({});
    }
}
export = Navigation;