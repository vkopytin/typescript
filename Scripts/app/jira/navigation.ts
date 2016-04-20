import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');
var components = {
        'jira-report': ['app/jira/pages/jira_page', 'app/jira/view_models/jira_view_model'],
        'deploy-email': ['app/jira/pages/email_page', 'app/jira/view_models/email_view_model']
    },
    inst;

class Navigation extends Base {
    view: any

    constructor(opts) {
        super();
        this.init(opts);
    }

    init (opts) {
        Base.prototype.init.apply(this, arguments);
    }
    getView () {
        var match = window.location.href.match(/#(.*)$/);
        return match ? match[1] : '';
    }
    setHash (hashPath) {
        window.location.hash = '#' + hashPath;
    }
    loadComponent (componentName) {
        var inst = this,
            deps = components[componentName];
            
        this.view && _.defer(_.bind(this.view.onNavigateFrom, this.view), 0);
        this.setHash(componentName);
        
        if (deps) {
            require(deps, function (View, ViewModel) {
                inst.view = new View({
                    el: $(document.body),
                    viewModel: new ViewModel()
                });
                inst.view.draw();
                
                _.defer(_.bind(inst.view.onNavigateTo, inst.view), 0);
            });
        }
    }
    static getInstance () {
        if (inst) {
            return inst;
        }
    
        return inst = new Navigation({});
    }
}
export = Navigation;