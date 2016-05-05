/// <reference path="../base/base.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../view_models/page_view_model.ts" />
/// <reference path="../view_models/email_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import Base = require('app/jira/base/base');
import Utils = require('app/jira/utils');
import template = require('hgn!app/jira/templates/page_template');
import template2 = require('app/jira/templates/email_page_template');
import EmailViewModel = require('app/jira/view_models/email_view_model');

interface IEmailPage {
    
}

class EmailPage extends BaseView<EmailViewModel, IEmailPage> {
    commands (): any {
        return {
            'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
            'click.command .jira-jira-report': 'JiraReportNavigateCommand'
        };
    }
    handlers = {
        onDraw: () => {
            $('#main-menu').metisMenu();
        }
    }
    init (options: any): void {
        this.$el = options.el || $(document.body);
        _.extend(this.handlers, options.handlers || {});
        
        super.init(options);
    }
    finish (): void {
        this.$el.off();
        this.$el.empty();
        delete this.$el;
        
        Base.prototype.finish.apply(this, arguments);
    }
    
    onNavigateTo (): any {
        this.handlers.onDraw.call(this);
        return super.onNavigateTo();
    }
    
    render () {
        return template2.call(this, this.viewModel);
    }
    
    static initHTML ($el: any) {
        var data = {},
            html = template(data),
            res = $.Deferred();
            
        $el.html(html);
    }
    
    draw (): any {
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