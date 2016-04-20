/// <reference path="../base/base_view.ts" />

import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('hgn!app/jira/templates/panel_template');
    
class PanelView extends BaseView {
    opts: any
    
    init (opts) {
        this.$el = opts.el ? $(opts.el) : $('<div />');
        super.init(opts);
        this.opts = opts;
    }
    draw () {
        var data = {
                title: this.opts.title
            },
            html = template(data);
        
        this.$el.html(html);
        
        return this;
    }
}
export = PanelView;