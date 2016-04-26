/// <reference path="../base/base_view.ts" />

import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('hgn!app/jira/templates/panel_template');
import JiraViewModel = require('app/jira/view_models/jira_view_model');

interface IPanelView {
    
}

class PanelView extends BaseView<JiraViewModel, IPanelView> {
    opts: any
    
    init (opts: any): void {
        this.$el = opts.el ? $(opts.el) : $('<div />');
        super.init(opts);
        this.opts = opts;
    }
    
    draw (): any {
        var data = {
                title: this.opts.title
            },
            html = template(data);
        
        this.$el.html(html);
        
        return this;
    }
}
export = PanelView;