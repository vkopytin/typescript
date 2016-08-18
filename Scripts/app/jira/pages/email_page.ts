/// <reference path="../base/base.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../view_models/page_view_model.ts" />
/// <reference path="../view_models/email_report/email_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import IBaseView = require('app/jira/base/i_base_view');
import BaseView = require('app/jira/base/base_view');
import Base = require('app/jira/base/base');
import Utils = require('app/jira/utils');
import template = require('app/jira/pages/email_page_template');
import master_page_template = require('app/jira/templates/master_page_template');
import EmailViewModel = require('app/jira/view_models/email_report/email_view_model');
import React = require('react');

interface IEmailPage extends IBaseView {
    
}

class EmailPage extends BaseView<EmailViewModel, IEmailPage> {

    handlers = {
        onDraw: () => {
            $('#main-menu').metisMenu();
        }
    }
    init (options: any): void {
        _.extend(this.handlers, options.handlers || {});
        
        super.init(options);
    }
    finish (): void {
        Base.prototype.finish.apply(this, arguments);
    }
    
    onNavigateTo (): any {
        this.handlers.onDraw.call(this);
        return super.onNavigateTo();
    }
    
    render () {
        return master_page_template.call(this,
                template.call(this, this.props.viewModel)
            );
    }
}
export = EmailPage;