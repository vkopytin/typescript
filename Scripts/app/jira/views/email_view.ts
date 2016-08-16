/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/email_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('app/jira/templates/email_template');
import emailTemplate = require('hgn!app/jira/templates/email_template');
import EmailViewModel = require('app/jira/view_models/email_view_model');
import Utils = require('app/jira/utils');
import ReactDOM = require('react-dom');

interface IEmailView {
    viewModel: EmailViewModel
}

class EmailView extends BaseView<EmailViewModel, IEmailView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            issues: this.props.viewModel.getIssues(),
            'email-to': 'qa@rebelmouse.com',
            subject: encodeURIComponent('Tomorrow deploy'),
            body: this.getEmailText()
        };
    }
    
    setIssues () {
        this.setState(_.extend({}, this.state, {
            issues: this.props.viewModel.getIssues()
        }));
    }

    componentWillMount () {
        $(this.props.viewModel).on('change:issues', _.bind(this.setIssues, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:issues');
    }
    
    componentWillReceiveProps (props: any) {
        $(this.props.viewModel).off('change:issues');
        $(props.viewModel).on('change:issues', _.bind(this.setIssues, this));
    }
    
    getEmailHTML () {
        var data = {
            issues: () => {
                    return _.map(this.props.viewModel.getIssues(), (issue) => issue.toJSON());
                }
            },
            html = emailTemplate(data);
            
        return { __html: html };
    }
    
    getEmailText () {
        var html = this.getEmailHTML();
        
        return encodeURIComponent($('<div/>').html(html.__html).text());
    }
    
    render () {
        return template.call(this);
    }
}
export = EmailView;