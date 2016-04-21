/// <reference path="../../vendor.d.ts" />
/// <reference path="base/base.ts" />
import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');
var components = {
        'jira-report': ['app/jira/pages/jira_page', 'app/jira/view_models/jira_view_model'],
        'deploy-email': ['app/jira/pages/email_page', 'app/jira/view_models/email_view_model']
    },
    inst: Navigation;

class Navigation extends Base {
    view: any

    constructor(opts) {
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
            
        this.view && _.defer(_.bind(this.view.onNavigateFrom, this.view), 0);
        this.setHash(componentName);
        
        if (deps) {
            require(deps, (View, ViewModel) => {
                this.view = new View({
                    el: $(document.body),
                    viewModel: new ViewModel()
                });
                this.view.draw();
                
                _.defer(_.bind(this.view.onNavigateTo, this.view), 0);
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