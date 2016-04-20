/// <reference path="../base/base.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../utils.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import Base = require('app/jira/base/base');
import Utils = require('app/jira/utils');
import template = require('hgn!app/jira/templates/page_template');
    
class EmailPage extends BaseView {
    commands () {
        return {
            'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
            'click.command .jira-jira-report': 'JiraReportNavigateCommand'
        };
    }
    handlers = {
        onDraw: function () {
            $('#main-menu').metisMenu();
        }
    }
    init (options) {
        this.$el = options.el || $(document.body);
        _.extend(this.handlers, options.handlers || {});
        
        super.init(options);
    }
    finish () {
        this.$el.off();
        this.$el.empty();
        delete this.$el;
        
        Base.prototype.finish.apply(this, arguments);
    }
    draw () {
        var data = {},
            html = template(data);
            
        this.$el.html(html);
        
        Utils.loadViews({
            emailView: ['app/jira/views/email_view', {
                el: '#page-wrapper',
                viewModel: this.viewModel
            }]
        }, this);
                    
        this.handlers.onDraw.call(this);
        
        return this;              
    }
}
export = EmailPage;