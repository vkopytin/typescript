/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/email_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('hgn!app/jira/templates/email_template');
import emailTemplate = require('hgn!app/main/templates/deploy_email.email_template');
import EmailViewModel = require('app/jira/view_models/email_view_model');

interface IEmailView {
    
}

class EmailView extends BaseView<EmailViewModel, IEmailView> {
    $el: any
    
    init (opts: any) {
        this.$el = opts.el || $('<div/>');
        super.init(opts);
        
        $(this.viewModel).on('change:issues', _.bind(this.draw, this));
    }
    
    draw () {
        var data = {
                issues: _.map(this.viewModel.getIssues(), (viewModel) => viewModel.toJSON())
            },
            html = template(data);
        
        this.$el.html(html);
        
        $('.auto-email', this.$el).html(emailTemplate({
            'email-to': 'qa@rebelmouse.com',
            subject: encodeURIComponent('Tomorrow deploy'),
            body: encodeURIComponent($('.email-contents', this.$el).text())
        }));
        
        return this;
    }
}
export = EmailView;